// タグと日本語の対応表
export const TAG_MAP = {
  "EXEC": "実行・優先度",
  "FLOW": "過集中・切替",
  "ENER": "集中の波・眠気",
  "MOTV": "動機・刺激",
  "RUTN": "ルーチン・突発弱さ",
  "BIO": "睡眠・生活リズム",
  "ENVR": "天候・環境",
  "PHYS": "体力・痛み",
  "AUTO": "自律神経・ホルモン",
  "IMMU": "免疫・アレルギー",
  "SOMA": "身体感覚鈍麻",
  "MED": "医療・服薬",
  "NUTR": "栄養",
  "MEMO": "記憶",
  "ORG": "整理・忘れ物",
  "DECI": "判断困難",
  "PRAG": "文脈理解・曖昧さ",
  "STRE": "ストレス耐性",
  "ANX": "不安・パニック",
  "MOOD": "気分変動",
  "PERF": "緊張・プレッシャー",
  "ANGR": "怒り制御",
  "TRMA": "トラウマ影響",
  "COMM": "会話のやりとり",
  "EMEX": "感情表現",
  "SOC": "人間関係・配慮調整",
  "ROLE": "役割不明瞭",
  "RULE": "ルール・規範曖昧",
  "TECH": "ツール適応",
  "ISO": "孤立・支援不足",
  "CARE": "家族・生活影響",
  "CARR": "キャリア不安",
  "EVAL": "評価制度・フィードバック",
  "CULT": "組織文化・人間関係",
  "SENS": "感覚過敏",
  "TEMP": "温度",
  "SPAC": "空間・人混み",
  "DIST": "移動・距離"
} as const;

// 型定義
export type TagKey = keyof typeof TAG_MAP;
export type TagValue = typeof TAG_MAP[TagKey];

// タグキーから日本語名を取得するヘルパー関数
export const getTagName = (tagKey: string): string => {
  return TAG_MAP[tagKey as TagKey] || tagKey;
};

// 日本語名からタグキーを取得するヘルパー関数
export const getTagKey = (tagName: string): string | undefined => {
  const entry = Object.entries(TAG_MAP).find(([_, value]) => value === tagName);
  return entry ? entry[0] : undefined;
};
