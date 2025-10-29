// recommender.ts
// InclusiBridge｜配慮案レコメンド（3択用）
// 目的：各カードのタグからスコアを算出 → ⭐おすすめを1つ選定し、理由を返す

// -------- 型定義 --------
export type Level3 = "低" | "中" | "高";
export type EffectType = "即効性" | "持続性" | "局所的" | "全体に波及";
export type Legal = "義務" | "努力義務" | "任意";

export type TagSet = {
  // 最低限：初期表示で使っているもの
  cost?: Level3;                // コスト
  difficulty?: Level3;          // 導入難易度
  legal?: Legal;                // 法的根拠
  psychological?: Level3;       // 「頼みやすさ」（実装上は心理的コストの反転）
  effect?: EffectType;          // 効果・影響（概要）
  // 任意：詳細表示/内部計算で使える
  leadTimeDays?: number;        // 導入期間（日）
  upkeepHoursPerMonth?: number; // 継続運用工数（h/月）
  stakeholders?: number;        // 関与人数
  expertise?: Level3;           // 専門性要求度
};

export type Accommodation = {
  id: string;
  label: string;    // 配慮案A/B/C など
  title: string;
  tags: TagSet;
};

export type Preference = {
  // ユーザー嗜好の重み（合計1でなくてOK。内部で正規化）
  // 例：頼みやすさ重視なら psychological を大きく
  weights?: Partial<{
    cost: number;
    difficulty: number;
    psychological: number;
    effect: number;
    legal: number;
    leadTime: number;
    upkeep: number;
    stakeholders: number;
    expertise: number;
  }>;
  // ルール系の制約（上限や最低条件）
  hardLimits?: Partial<{
    maxCost: Level3;           // "低" | "中" | "高" （上限）
    maxDifficulty: Level3;
    minLegal: Legal;           // "任意" < "努力義務" < "義務"
    maxLeadTimeDays: number;
    maxUpkeepHoursPerMonth: number;
  }>;
};

export type ScoredResult = {
  id: string;
  label: string;
  title: string;
  score: number;                 // 総合スコア（0-1）
  badges: string[];              // UIで使える短い根拠
  reason: string;                // 推薦理由（自然言語）
  debug?: Record<string, any>;   // 各項目スコア（デバッグ用）
};

// -------- 定数・ヘルパ --------
const lvl = (v?: Level3, reverse = false): number => {
  // 低=良, 高=悪 の指標（コスト/難易度/工数 等）では reverse=false
  // 低=悪, 高=良 の指標（頼みやすさ 等）は reverse=true で正方向に
  const map: Record<Level3, number> = { 低: 1, 中: 0.5, 高: 0 };
  const x = v ? map[v] : 0.5;
  return reverse ? 1 - x : x;
};
const legalWeight = (v?: Legal): number =>
  v === "義務" ? 1 : v === "努力義務" ? 0.6 : v === "任意" ? 0.3 : 0.5;

const effectWeight = (e?: EffectType): number =>
  e === "即効性" ? 0.85 :
  e === "全体に波及" ? 0.75 :
  e === "持続性" ? 0.7 :
  e === "局所的" ? 0.55 : 
  e ? 0.6 : 0.5; // undefinedの場合は0.5を返す

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

// 数値系を0-1へ（閾値は適宜調整）
const invScale = (v: number | undefined, goodMax: number, hardMax: number): number => {
  if (v == null) return 0.5;                 // 未設定は中立
  if (v <= goodMax) return 1;                // ここまでなら満点
  if (v >= hardMax) return 0;                // ここ超えは0
  // 線形で落とす
  const t = (v - goodMax) / (hardMax - goodMax);
  return clamp01(1 - t);
};

// デフォ重み（合計1に正規化される前）
const DEFAULT_WEIGHTS = {
  cost: 0.18,
  difficulty: 0.16,
  psychological: 0.16,
  effect: 0.20,
  legal: 0.15,
  leadTime: 0.08,
  upkeep: 0.04,
  stakeholders: 0.02,
  expertise: 0.01, // 初期は影響弱め（支援者UIでは上げても良い）
};

// -------- スコアリング本体 --------
export function recommend(
  items: Accommodation[],
  pref: Preference = {}
): ScoredResult[] {
  const W = { ...DEFAULT_WEIGHTS, ...(pref.weights || {}) };
  // 正規化（合計1）
  const sumW = Object.values(W).reduce((a, b) => a + b, 0) || 1;
  Object.keys(W).forEach(k => ((W as any)[k] = (W as any)[k] / sumW));

  // ハード制約を関数化
  const limit = pref.hardLimits || {};
  const passHard = (t: TagSet): boolean => {
    if (limit.maxCost && lvl(t.cost) < lvl(limit.maxCost)) return false;
    if (limit.maxDifficulty && lvl(t.difficulty) < lvl(limit.maxDifficulty)) return false;
    if (limit.minLegal) {
      const order: Legal[] = ["任意", "努力義務", "義務"];
      const ok = order.indexOf(t.legal ?? "任意") >= order.indexOf(limit.minLegal);
      if (!ok) return false;
    }
    if (typeof limit.maxLeadTimeDays === "number" && (t.leadTimeDays ?? 0) > limit.maxLeadTimeDays) return false;
    if (typeof limit.maxUpkeepHoursPerMonth === "number" && (t.upkeepHoursPerMonth ?? 0) > limit.maxUpkeepHoursPerMonth) return false;
    return true;
  };

  const results: ScoredResult[] = items.map((it) => {
    const t = it.tags;

    // 個別項目スコア（0-1）
    const s_cost  = lvl(t.cost);                           // 低ほど高得点
    const s_diff  = lvl(t.difficulty);                     // 低ほど高得点
    const s_psy   = lvl(t.psychological, true);            // 「頼みやすさ」= 高ほど高得点
    const s_eff   = effectWeight(t.effect);                // 効果
    const s_legal = legalWeight(t.legal);                  // 法的
    const s_lead  = invScale(t.leadTimeDays, 7, 45);       // 1週間以内満点, 45日以上0
    const s_keep  = invScale(t.upkeepHoursPerMonth, 2, 12);// 月2h満点, 12h以上0
    const s_people= invScale(t.stakeholders, 2, 10);       // 2人まで満点, 10人以上0
    const s_expt  = lvl(t.expertise);                      // 低ほど高得点

    // デバッグ: NaNチェック
    const debugValues = {
      s_cost, s_diff, s_psy, s_eff, s_legal, s_lead, s_keep, s_people, s_expt,
      W_cost: W.cost, W_difficulty: W.difficulty, W_psychological: W.psychological,
      W_effect: W.effect, W_legal: W.legal, W_leadTime: W.leadTime,
      W_upkeep: W.upkeep, W_stakeholders: W.stakeholders, W_expertise: W.expertise
    };
    
    // NaNが含まれているかチェック
    const hasNaN = Object.values(debugValues).some(v => isNaN(v as number));
    if (hasNaN) {
      console.error('NaN detected in calculation for', it.id, debugValues);
    }

    // 総合スコア
    let score =
      W.cost        * s_cost  +
      W.difficulty  * s_diff  +
      W.psychological * s_psy +
      W.effect      * s_eff   +
      W.legal       * s_legal +
      W.leadTime    * s_lead  +
      W.upkeep      * s_keep  +
      W.stakeholders* s_people+
      W.expertise   * s_expt;

    // ルール系ボーナス/ペナルティ（微調整）
    // 例：コスト=低＆難易度=低 → +0.03（Quick Win）
    if (t.cost === "低" && t.difficulty === "低") score += 0.03;
    // 例：法的=義務 → +0.02（安心感ブースト）
    if (t.legal === "義務") score += 0.02;
    // 例：即効性×短期導入 → +0.02
    if (t.effect === "即効性" && (t.leadTimeDays ?? 999) <= 7) score += 0.02;

    // ハード制約違反は大幅減点
    if (!passHard(t)) score -= 0.5;

    // クリッピング
    score = clamp01(score);

    // バッジ（タグとして使用）
    const badges: string[] = [];
    if (t.cost) badges.push(`💰コスト：${t.cost}`);
    if (t.difficulty) badges.push(`⚡難易度：${t.difficulty}`);
    if (t.legal) badges.push(`⚖️法的根拠：${t.legal}`);
    if (t.psychological) badges.push(`💬頼みやすさ：${t.psychological}`);
    if (t.effect) badges.push(`🌱効果：${t.effect}`);

    const reasons: string[] = [];
    if (t.cost === "低") reasons.push("低コストで始められる");
    if (t.difficulty === "低") reasons.push("導入が容易");
    if (t.legal === "義務" || t.legal === "努力義務") reasons.push("制度面の裏付けがある");
    if (t.psychological === "高") reasons.push("お願いしやすい");
    if ((t.leadTimeDays ?? 999) <= 7) reasons.push("短期間で試せる");
    if ((t.upkeepHoursPerMonth ?? 0) <= 2) reasons.push("運用負担が小さい");
    if (t.effect === "即効性") reasons.push("効果が出やすい");

    const reason =
      reasons.length > 0
        ? `この配慮は${reasons.slice(0, 3).join("・")}点が強みです。`
        : "主要指標のバランスが良好です。";

    return {
      id: it.id,
      label: it.label,
      title: it.title,
      score,
      badges,
      reason,
      debug: {
        s_cost, s_diff, s_psy, s_eff, s_legal, s_lead, s_keep, s_people, s_expt,
        weights: W,
        raw_tags: t,
        final_score: score
      },
    };
  });

  // スコア降順。タイは「法的＞即効性＞低コスト」を優先
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const get = (id: string) => items.find(x => x.id === id)?.tags;
    const ta = get(a.id), tb = get(b.id);
    const byLegal = (legalWeight(tb?.legal) - legalWeight(ta?.legal));
    if (byLegal !== 0) return byLegal;
    const byEffect = (effectWeight(tb?.effect) - effectWeight(ta?.effect));
    if (byEffect !== 0) return byEffect;
    const byCost = (lvl(tb?.cost) - lvl(ta?.cost));
    return byCost;
  });

  return results;
}

// -------- 使用例 --------
/*
const ranked = recommend(cards, {
  weights: { psychological: 0.28, cost: 0.22, effect: 0.2 }, // 例：頼みやすさ重視
  hardLimits: { maxCost: "中", maxDifficulty: "高", minLegal: "任意", maxLeadTimeDays: 30 },
});
const top = ranked[0]; // ⭐おすすめ
*/
