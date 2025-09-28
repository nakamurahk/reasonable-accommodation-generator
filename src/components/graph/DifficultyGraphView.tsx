import React, { useMemo, useState, useRef, useEffect } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { ElementDefinition, LayoutOptions, Core } from 'cytoscape';
import { getTagName } from '../../constants/tagMap';
// import reasonableAccommodations from '../../data/user/ReasonableAccommodation.json';
import { useIsMobile } from '../../hooks/useIsMobile';

// カテゴリ別色分け
const CATEGORY_COLORS: { [key: string]: string } = {
  '注意・集中': '#3B82F6', // 青
  '感情・ストレス反応': '#EF4444', // 赤
  '身体症状・体調': '#10B981', // 緑
  '感覚・環境': '#F59E0B', // オレンジ
  '実行・計画・記憶': '#8B5CF6', // 紫
  'コミュニケーション': '#EC4899', // ピンク
  '生活・変化対応': '#06B6D4', // シアン
  '職場・社会不安': '#84CC16', // ライム
  'その他': '#6B7280' // グレー
};

// タグノードの色
const TAG_NODE_COLOR = '#E5E7EB'; // ライトグレー

interface DifficultyGraphViewProps {
  selectedDifficulties: string[];
  domain?: { name: string };
  viewModel?: any[] | null; // 新しいデータ構造を追加
}

interface TagWeight {
  tag: string;
  count: number;
  isMain: boolean;
}

interface DifficultyConnection {
  source: string;
  target: string;
  weight: number;
  sharedTags: string[];
}

interface TagHitCount {
  tag: string;
  count: number;
}

// 定数
const MAX_SELECTED_TAGS = 4;
const TOP_HITS = 5;
// const MAX_MAIN_TAGS = 5;
// const DEBOUNCE_MS = 200;
const MAX_TAG_CHIPS = 3;

// タグのひとこと定義
const TAG_DEFINITIONS: { [key: string]: string } = {
  'EXEC': 'やる順・切り分け・手順化の苦手さ',
  'FLOW': '没頭しすぎ／切替が難しい',
  'ENER': '集中や眠気の波が大きい',
  'MOTV': '単調や低刺激で続かない',
  'RUTN': '予定変更・突発に弱い',
  'BIO': '睡眠・生活リズムの乱れ',
  'ENVR': '天候・環境に左右される',
  'PHYS': '体力・痛み・姿勢の難しさ',
  'AUTO': '自律神経・ホルモンの影響',
  'IMMU': 'アレルギー体質の影響',
  'SOMA': '身体の違和感に気づきにくい',
  'MED': '通院・服薬・副作用の影響',
  'NUTR': '食事・血糖の影響',
  'MEMO': '覚えられない／忘れやすい',
  'ORG': '片付け・管理・抜け漏れ',
  'DECI': '決めきれない・迷走しがち',
  'PRAG': '文脈・意図・曖昧さで迷う',
  'STRE': 'ストレスに参りやすい',
  'ANX': '予期不安・パニック反応',
  'MOOD': '気分の波・回復の遅さ',
  'PERF': '人前・評価場面で緊張',
  'ANGR': '怒りが制御しづらい',
  'TRMA': '過去体験の影響が残る',
  'COMM': '会話のやりとりが難しい',
  'EMEX': '感情を言葉や表情に載せづらい',
  'SOC': '配慮依頼や関係調整が負担',
  'ROLE': '役割や期待が曖昧',
  'RULE': 'ルール・慣習が曖昧／過剰に気にする',
  'TECH': 'ツール・機器が負担',
  'ISO': '支援/つながりが不足',
  'CARE': '家族・生活への負担感',
  'CARR': '将来・継続への不安',
  'EVAL': '評価や昇進の不透明さ',
  'CULT': '組織文化とのミスマッチ',
  'SENS': '光/音/におい/触覚の過敏',
  'TEMP': '温度の影響が強い',
  'SPAC': '人混み・出入り・同室が負担',
  'DIST': '移動・距離が負担'
};

// タグのカテゴリ分類
const TAG_CATEGORIES: { [key: string]: string } = {
  'EXEC': '実行・優先度',
  'FLOW': '過集中・切替',
  'ENER': '集中の波・眠気',
  'MOTV': '動機・刺激',
  'RUTN': 'ルーチン・突発弱さ',
  'BIO': '睡眠・生活リズム',
  'ENVR': '天候・環境',
  'PHYS': '体力・痛み',
  'AUTO': '自律神経・ホルモン',
  'IMMU': '免疫・アレルギー',
  'SOMA': '身体感覚鈍麻',
  'MED': '医療・服薬',
  'NUTR': '栄養',
  'MEMO': '記憶',
  'ORG': '整理・忘れ物',
  'DECI': '判断困難',
  'PRAG': '文脈理解・曖昧さ',
  'STRE': 'ストレス耐性',
  'ANX': '不安・パニック',
  'MOOD': '気分変動',
  'PERF': '緊張・プレッシャー',
  'ANGR': '怒り制御',
  'TRMA': 'トラウマ影響',
  'COMM': '会話のやりとり',
  'EMEX': '感情表現',
  'SOC': '人間関係・配慮調整',
  'ROLE': '役割不明瞭',
  'RULE': 'ルール・規範曖昧',
  'TECH': 'ツール適応',
  'ISO': '孤立・支援不足',
  'CARE': '家族・生活影響',
  'CARR': 'キャリア不安',
  'EVAL': '評価制度・フィードバック',
  'CULT': '組織文化・人間関係',
  'SENS': '感覚過敏',
  'TEMP': '温度',
  'SPAC': '空間・人混み',
  'DIST': '移動・距離'
};

interface DifficultyData {
  '困りごと内容': string;
  'カテゴリ': string;
  '主要タグ': string;
  '補助タグ': string;
  '企業具体例': string;
  '教育機関具体例': string;
  '支援機関具体例': string;
}

const DifficultyGraphView: React.FC<DifficultyGraphViewProps> = ({ 
  selectedDifficulties, 
  domain,
  viewModel = []
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [highlightedTag] = useState<string | null>(null);
  const [showMainTagsOnly, setShowMainTagsOnly] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedTagForBottomSheet, setSelectedTagForBottomSheet] = useState<string | null>(null);
  const [showAllDifficulties, setShowAllDifficulties] = useState(false);
  const isProcessingClick = useRef(false);
  const cyRef = useRef<Core | null>(null);
  const isInitialized = useRef(false);
  const isMobile = useIsMobile();

  // showMainTagsOnlyの状態変更時は位置調整しない（デフォルト表示を維持）
  // useEffect(() => {
  //   if (cyRef.current && isInitialized.current) {
  //     setTimeout(() => {
  //       if (isMobile) {
  //         cyRef.current!.fit(undefined, 10);
  //         cyRef.current!.pan({ x: 0, y: 0 }); // 上部余白を大幅に調整（iPhone対応）
  //         cyRef.current!.zoom(1.0);
  //       } else {
  //         cyRef.current!.fit(undefined, 20);
  //         cyRef.current!.center();
  //       }
  //     }, 100);
  //   }
  // }, [showMainTagsOnly, isMobile]);

  // プリ計算：タグ→困りごとIDの逆インデックス
  const tagToDifficultiesIndex = useMemo(() => {
    const index: { [tag: string]: Set<string> } = {};
    // 新しいデータ構造から困りごとデータを取得
    const selectedDifficultyData: DifficultyData[] = viewModel
      ? viewModel
          .filter((vm: any) => selectedDifficulties.includes(vm.concern.title))
          .map((vm: any) => ({
            '困りごと内容': vm.concern.title,
            'カテゴリ': vm.concern.category,
            '主要タグ': vm.concern.primary_tags.join(','),
            '補助タグ': vm.concern.secondary_tags.join(','),
            '企業具体例': vm.concern.examples['企業']?.join(',') || '',
            '教育機関具体例': vm.concern.examples['教育機関']?.join(',') || '',
            '支援機関具体例': vm.concern.examples['支援機関']?.join(',') || '',
          }))
      : [];

    selectedDifficultyData.forEach((difficulty: DifficultyData) => {
      const mainTags = difficulty['主要タグ'] ? difficulty['主要タグ'].split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];
      const subTags = difficulty['補助タグ'] ? difficulty['補助タグ'].split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];
      const allTags = [...mainTags, ...subTags];

      allTags.forEach(tag => {
        if (!index[tag]) {
          index[tag] = new Set();
        }
        index[tag].add(difficulty['困りごと内容']);
      });
    });

    // Setを配列に変換
    const result: { [tag: string]: string[] } = {};
    Object.keys(index).forEach(tag => {
      result[tag] = Array.from(index[tag]);
    });

    return result;
  }, [selectedDifficulties]);

  // タグのヒット数計算
  const getTagHitCounts = useMemo(() => {
    const counts: TagHitCount[] = [];
    
    Object.entries(tagToDifficultiesIndex).forEach(([tag, difficulties]) => {
      // タグのヒット数は常に固定（そのタグを持つ困りごとの総数）
      const hitCount = difficulties.length;
      counts.push({ tag, count: hitCount });
    });
    
    return counts;
  }, [tagToDifficultiesIndex]);

  // グラフデータの生成
  const graphData = useMemo(() => {
    if (selectedDifficulties.length === 0) {
      return { nodes: [], edges: [] };
    }

    const nodes: ElementDefinition[] = [];
    const edges: ElementDefinition[] = [];

    // 選択された困りごとのデータを取得（重複除去）
    const selectedDifficultyData: DifficultyData[] = viewModel
      ? viewModel
          .filter((vm: any) => selectedDifficulties.includes(vm.concern.title))
          .map((vm: any) => ({
            '困りごと内容': vm.concern.title,
            'カテゴリ': vm.concern.category,
            '主要タグ': vm.concern.primary_tags.join(','),
            '補助タグ': vm.concern.secondary_tags.join(','),
            '企業具体例': vm.concern.examples['企業']?.join(',') || '',
            '教育機関具体例': vm.concern.examples['教育機関']?.join(',') || '',
            '支援機関具体例': vm.concern.examples['支援機関']?.join(',') || '',
          }))
      : [];

    // タグの重み計算（出現回数とタイプ）
    const tagWeights: { [key: string]: TagWeight } = {};
    const difficultyTags: { [key: string]: { main: string[], sub: string[] } } = {};

    selectedDifficultyData.forEach((difficulty: DifficultyData) => {
      const mainTags = difficulty['主要タグ'] ? difficulty['主要タグ'].split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];
      const subTags = difficulty['補助タグ'] ? difficulty['補助タグ'].split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];
      
      difficultyTags[difficulty['困りごと内容']] = { main: mainTags, sub: subTags };


      // 主要タグの重み計算（core=2点）
      mainTags.forEach(tag => {
        if (!tagWeights[tag]) {
          tagWeights[tag] = { tag, count: 0, isMain: true };
        }
        tagWeights[tag].count += 2;
      });

      // 補助タグの重み計算（sub=1点）
      subTags.forEach(tag => {
        if (!tagWeights[tag]) {
          tagWeights[tag] = { tag, count: 0, isMain: false };
        }
        tagWeights[tag].count += 1;
      });
    });


    // 主要タグの選定（出現回数順、core優先、最大5個）
    // ただし、少なくとも1つの困りごとが持つタグは含める
    const sortedTags = Object.values(tagWeights)
      .sort((a, b) => {
        if (a.count !== b.count) return b.count - a.count;
        return a.isMain ? -1 : 1; // 同点ならcore優先
      });
    
    // 上位5個を選ぶが、各困りごとが持つタグが少なくとも1つ含まれるように調整
    const selectedTags = sortedTags.slice(0, 5);
    
    // 各困りごとが持つタグが主要タグに含まれているかチェック
    const missingTags = new Set<string>();
    selectedDifficultyData.forEach((difficulty: DifficultyData) => {
      const allTags = [...difficultyTags[difficulty['困りごと内容']].main, ...difficultyTags[difficulty['困りごと内容']].sub];
      const hasMainTag = allTags.some(tag => (selectedTags as unknown as string[]).includes(tag));
      if (!hasMainTag && allTags.length > 0) {
        // この困りごとの最も重要なタグを追加
        const mostImportantTag = allTags.find(tag => tagWeights[tag]?.isMain) || allTags[0];
        missingTags.add(mostImportantTag);
      }
    });
    
    // 不足しているタグを追加（最大5個まで）
    const finalTags = [...selectedTags];
    missingTags.forEach(tag => {
      if (finalTags.length < 5 && !finalTags.some(t => t.tag === tag)) {
        finalTags.push(tagWeights[tag]);
      }
    });
    

    // 困りごと同士の接続重み計算
    const connections: DifficultyConnection[] = [];
    const difficultyList = selectedDifficultyData.map((d: DifficultyData) => d['困りごと内容']);

    for (let i = 0; i < difficultyList.length; i++) {
      for (let j = i + 1; j < difficultyList.length; j++) {
        const source = difficultyList[i];
        const target = difficultyList[j];
        
        // 自分自身との接続は除外
        if (source === target) continue;
        
        const sourceTags = difficultyTags[source];
        const targetTags = difficultyTags[target];

        let weight = 0;
        const sharedTags: string[] = [];
        
        // 重複を防ぐために、各タグを1回だけカウント
        const sourceAllTags = [...sourceTags.main, ...sourceTags.sub];
        const targetAllTags = [...targetTags.main, ...targetTags.sub];
        
        // 共通タグを取得
        const commonTags = sourceAllTags.filter(tag => targetAllTags.includes(tag));
        
        // 各共通タグについて、より高い重みを適用
        commonTags.forEach(tag => {
          const isSourceMain = sourceTags.main.includes(tag);
          const isTargetMain = targetTags.main.includes(tag);
          
          if (isSourceMain && isTargetMain) {
            // 両方とも主要タグ: 2点
            weight += 2;
          } else if (isSourceMain || isTargetMain) {
            // 片方が主要タグ: 1点
            weight += 1;
          } else {
            // 両方とも補助タグ: 1点
            weight += 1;
          }
          
          sharedTags.push(tag);
        });

        if (weight >= 2) {
          connections.push({ source, target, weight, sharedTags });
        }
      }
    }

    // 各困りごとの上位3件の接続に限定
    const limitedConnections: DifficultyConnection[] = [];
    difficultyList.forEach((difficulty: string) => {
      const relatedConnections = connections
        .filter(conn => conn.source === difficulty || conn.target === difficulty)
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 3);
      limitedConnections.push(...relatedConnections);
    });

    // 重複除去（自己ループも除外）
    const uniqueConnections = limitedConnections.filter((conn, index, arr) => {
      // 自己ループを除外
      if (conn.source === conn.target) return false;
      
      // 重複を除外
      return arr.findIndex(c => 
        (c.source === conn.source && c.target === conn.target) ||
        (c.source === conn.target && c.target === conn.source)
      ) === index;
    });

    // 困りごとのスコア計算（選択タグとの関連度）
    const difficultyScores = selectedDifficultyData.map((difficulty: DifficultyData) => {
      const mainTags = difficultyTags[difficulty['困りごと内容']].main;
      const subTags = difficultyTags[difficulty['困りごと内容']].sub;
      
      let score = 0;
      const currentSelectedTags = selectedTags as unknown as string[];
      
      if (currentSelectedTags.length > 0) {
        currentSelectedTags.forEach((selectedTag: string) => {
          if (mainTags.includes(selectedTag)) score += 2; // core hit
          if (subTags.includes(selectedTag)) score += 1; // sub hit
        });
      }
      
      return {
        difficulty: difficulty['困りごと内容'],
        score: score,
        difficultyData: difficulty
      };
    });

    // スコア順でソート（上位5件をハイライト）
    const sortedDifficulties = difficultyScores.sort((a: { score: number }, b: { score: number }) => b.score - a.score);
    const currentSelectedTags = selectedTags as unknown as string[];
    const topHits = currentSelectedTags.length > 0 
      ? sortedDifficulties.slice(0, TOP_HITS).map((d: { difficulty: string }) => d.difficulty)
      : [];

    // 困りごとノードを作成
    selectedDifficultyData.forEach((difficulty: DifficultyData) => {
      const categoryColor = CATEGORY_COLORS[difficulty['カテゴリ']] || CATEGORY_COLORS['その他'];
      const degree = uniqueConnections.filter(conn => 
        conn.source === difficulty['困りごと内容'] || conn.target === difficulty['困りごと内容']
      ).length;
      
      // ノードサイズをdegreeに応じて決定（12-24px）
      const nodeSize = Math.max(12, Math.min(24, 12 + degree * 2));
      const isTopHit = topHits.includes(difficulty['困りごと内容']);
      const currentSelectedTags = selectedTags as unknown as string[];
      const shouldFade = currentSelectedTags.length > 0 && !isTopHit;

      // タグ情報を整理
      const mainTags = difficultyTags[difficulty['困りごと内容']].main;
      const subTags = difficultyTags[difficulty['困りごと内容']].sub;
      
      // 表示するタグを決定（優先度：選択タグ > core > よく出るsub）
      const displayTags: { tag: string; type: string; isSelected: boolean }[] = [];
      const selectedTagsInThisDifficulty = [...mainTags, ...subTags].filter(tag => 
        currentSelectedTags.includes(tag)
      );
      
      // 1. 選択中のタグを追加
      selectedTagsInThisDifficulty.forEach(tag => {
        displayTags.push({
          tag,
          type: mainTags.includes(tag) ? 'core' : 'sub',
          isSelected: true
        });
      });
      
      // 2. coreタグを追加（選択中でないもの）
      mainTags.filter(tag => !currentSelectedTags.includes(tag)).forEach(tag => {
        if (displayTags.length < MAX_TAG_CHIPS) {
          displayTags.push({
            tag,
            type: 'core',
            isSelected: false
          });
        }
      });
      
      // 3. subタグを追加（よく出るものから）
      subTags.filter(tag => !currentSelectedTags.includes(tag)).forEach(tag => {
        if (displayTags.length < MAX_TAG_CHIPS) {
          displayTags.push({
            tag,
            type: 'sub',
            isSelected: false
          });
        }
      });

      nodes.push({
        data: {
          id: difficulty['困りごと内容'],
          label: difficulty['困りごと内容'],
          type: 'difficulty',
          category: difficulty['カテゴリ'],
          difficultyData: difficulty,
          nodeSize: nodeSize,
          categoryColor: categoryColor,
          degree: degree,
          isTopHit: isTopHit,
          shouldFade: shouldFade,
          displayTags: displayTags,
          totalTagCount: mainTags.length + subTags.length
        }
      });
    });

    // タグノードを作成
    const tagsToShow = showMainTagsOnly ? finalTags : Object.values(tagWeights);
    tagsToShow.forEach((tagWeight: TagWeight) => {
      const hitCount = getTagHitCounts.find(h => h.tag === tagWeight.tag)?.count || 0;
      const isSelected = (selectedTags as unknown as string[]).includes(tagWeight.tag);
      const isDisabled = hitCount === 0;
      const tagName = getTagName(tagWeight.tag);
      const displayLabel = `${tagWeight.tag}\n${tagName}\n(${tagWeight.count})`;

      nodes.push({
        data: {
          id: `TAG_${tagWeight.tag}`,
          label: displayLabel,
          type: 'tag',
          tagName: tagWeight.tag,
          weight: tagWeight.count,
          isMain: tagWeight.isMain,
          hitCount: hitCount,
          isSelected: isSelected,
          isDisabled: isDisabled
        }
      });
    });

    // 困りごと同士の直接エッジを作成
    uniqueConnections.forEach(conn => {
      edges.push({
        data: {
          id: `${conn.source}_${conn.target}`,
          source: conn.source,
          target: conn.target,
          weight: conn.weight,
          type: 'difficulty-difficulty',
          sharedTags: conn.sharedTags
        }
      });
    });

    // 困りごと → タグのエッジを作成
    selectedDifficultyData.forEach((difficulty: DifficultyData) => {
      const allTags = [...difficultyTags[difficulty['困りごと内容']].main, ...difficultyTags[difficulty['困りごと内容']].sub];
      
      if (showMainTagsOnly) {
        // 主要タグのみ
        const mainTagNames = finalTags.map(t => t.tag);
        allTags.forEach(tag => {
          if (mainTagNames.includes(tag)) {
            edges.push({
              data: {
                id: `${difficulty['困りごと内容']}_${tag}`,
                source: difficulty['困りごと内容'],
                target: `TAG_${tag}`,
                type: 'difficulty-tag'
              }
            });
          }
        });
      } else {
        // 全タグ
        allTags.forEach(tag => {
          edges.push({
            data: {
              id: `${difficulty['困りごと内容']}_${tag}`,
              source: difficulty['困りごと内容'],
              target: `TAG_${tag}`,
              type: 'difficulty-tag'
            }
          });
        });
      }
    });

    return { nodes, edges };
  }, [selectedDifficulties, isMobile, showMainTagsOnly, selectedTags, getTagHitCounts]);

  // レイアウト設定（concentric：中心配置）
  // 表示領域にグラフ全体が収まるように調整
  const layout: LayoutOptions = {
    name: 'concentric',
    animate: false,
    concentric: (node: any) => {
      if (node.data('type') === 'difficulty') return 1; // 困りごと：内側
      return 2; // タグ：外側
    },
    levelWidth: () => 1,
    spacingFactor: 1.5, // PC版と統一
    minNodeSpacing: 30, // PC版と統一
    avoidOverlap: true,
    fit: false, // レイアウト自体ではフィットしない
    padding: 0 // レイアウトのパディングは0にして、後で手動で中央配置
  };

  // タグ選択ハンドラー
  const handleTagSelect = (tagName: string) => {
    setSelectedTags(prev => {
      const currentTags = Array.from(new Set(prev)); // 既存の重複を除去
      
      if (currentTags.includes(tagName)) {
        // 選択解除
        return currentTags.filter(tag => tag !== tagName);
      } else if (currentTags.length < MAX_SELECTED_TAGS) {
        // 選択追加
        return [...currentTags, tagName];
      }
      
      return currentTags; // 変更なし
    });
    
    // タグフィルタリング後も位置を調整（PC版と統一）
    setTimeout(() => {
      if (cyRef.current) {
        cyRef.current.fit(undefined, 20);
        cyRef.current.center();
      }
    }, 100);
  };

  // タグクリック処理（重複防止）
  const handleTagClick = (tagName: string) => {
    if (isProcessingClick.current) {
      return;
    }
    
    isProcessingClick.current = true;
    
    // タグを選択状態にする
    handleTagSelect(tagName);
    // ボトムシートを表示
    setSelectedTagForBottomSheet(tagName);
    
    // 少し遅延してからフラグをリセット
    setTimeout(() => {
      isProcessingClick.current = false;
    }, 100);
  };

  // ノードクリックハンドラー
  const handleNodeClick = (event: any) => {
    const node = event.target;
    const nodeData = node.data();
    
    if (nodeData.type === 'difficulty') {
      setSelectedNode(nodeData.id);
    } else if (nodeData.type === 'tag') {
      // タグクリック時の処理
      if (!nodeData.isDisabled) {
        // イベントの重複を防ぐために、一度だけ実行
        event.stopPropagation();
        
        // タグクリック処理を実行
        handleTagClick(nodeData.tagName);
      }
    }
  };

  // エッジホバーハンドラー
  const handleEdgeHover = (event: any) => {
    const edge = event.target;
    const edgeData = edge.data();
    
    if (edgeData.type === 'difficulty-difficulty' && edgeData.sharedTags) {
      const sharedTagsText = edgeData.sharedTags.join(', ');
      setTooltipContent(`共有: ${sharedTagsText}`);
      
      // マウス位置を取得
      const position = event.originalEvent;
      setTooltipPosition({ x: position.clientX, y: position.clientY });
    }
  };

  const handleEdgeLeave = () => {
    setTooltipContent(null);
    setTooltipPosition(null);
  };

  // タグボトムシート
  const renderTagBottomSheet = () => {
    if (!selectedTagForBottomSheet) return null;

    const tagName = selectedTagForBottomSheet;
    const tagDefinition = TAG_DEFINITIONS[tagName] || '定義なし';
    const tagCategory = TAG_CATEGORIES[tagName] || 'その他';
    const currentSelectedTags = selectedTags as unknown as string[];
    const isSelected = currentSelectedTags.includes(tagName);
    
    
    // 選択中の困りごとから、このタグに関連する困りごとを取得（重複除去）
    const selectedDifficultyData: DifficultyData[] = viewModel
      ? viewModel
          .filter((vm: any) => selectedDifficulties.includes(vm.concern.title))
          .map((vm: any) => ({
            '困りごと内容': vm.concern.title,
            'カテゴリ': vm.concern.category,
            '主要タグ': vm.concern.primary_tags.join(','),
            '補助タグ': vm.concern.secondary_tags.join(','),
            '企業具体例': vm.concern.examples['企業']?.join(',') || '',
            '教育機関具体例': vm.concern.examples['教育機関']?.join(',') || '',
            '支援機関具体例': vm.concern.examples['支援機関']?.join(',') || '',
          }))
      : [];
    
    const relatedDifficulties = selectedDifficultyData.filter((item: DifficultyData) => {
      const mainTags = item['主要タグ'] ? item['主要タグ'].split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0) : [];
      const subTags = item['補助タグ'] ? item['補助タグ'].split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0) : [];
      const allTags = [...mainTags, ...subTags];
      return allTags.includes(tagName);
    });

    // 困りごと内容で重複を除去（同じ困りごとは1つだけ）
    const uniqueDifficulties = relatedDifficulties.filter((item: DifficultyData, index: number, self: DifficultyData[]) => 
      index === self.findIndex((t: DifficultyData) => t['困りごと内容'] === item['困りごと内容'])
    );

    // スコア順でソート（主要タグを上位に）
    const sortedDifficulties = uniqueDifficulties.sort((a: DifficultyData, b: DifficultyData) => {
      const aMainTags = a['主要タグ'] ? a['主要タグ'].split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0) : [];
      const bMainTags = b['主要タグ'] ? b['主要タグ'].split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0) : [];
      const aIsMain = aMainTags.includes(tagName);
      const bIsMain = bMainTags.includes(tagName);
      
      if (aIsMain && !bIsMain) return -1;
      if (!aIsMain && bIsMain) return 1;
      return 0;
    });

    const displayDifficulties = showAllDifficulties ? sortedDifficulties : sortedDifficulties.slice(0, 6);

    // 共起タグを計算（重複除去後のデータを使用）
    const cooccurrenceTags: { [key: string]: number } = {};
    uniqueDifficulties.forEach((difficulty: DifficultyData) => {
      const mainTags = difficulty['主要タグ'] ? difficulty['主要タグ'].split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0) : [];
      const subTags = difficulty['補助タグ'] ? difficulty['補助タグ'].split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0) : [];
      const allTags = [...mainTags, ...subTags];
      
      allTags.forEach(tag => {
        if (tag !== tagName) {
          cooccurrenceTags[tag] = (cooccurrenceTags[tag] || 0) + 1;
        }
      });
    });

    const topCooccurrenceTags = Object.entries(cooccurrenceTags)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([tag]) => tag);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* オーバーレイ */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => {
            setSelectedTagForBottomSheet(null);
            // モーダルを閉じる時にグラフの位置とズームを元に戻す（PC版と統一）
            setTimeout(() => {
              if (cyRef.current) {
                cyRef.current.fit(undefined, 20);
                cyRef.current.center();
              }
            }, 150); // 遅延を少し長くして確実に実行
          }}
        />
        
        {/* モーダル */}
        <div className="relative w-full bg-white shadow-lg max-h-[80vh] flex flex-col rounded-2xl max-w-2xl">
          {/* ヘッダー */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-800">{tagName}</span>
              <span className="text-sm text-gray-500">｜{tagCategory}</span>
              <span className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full">
                {uniqueDifficulties.length}件
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedTagForBottomSheet(null);
                // モーダルを閉じる時にグラフの位置とズームを元に戻す（PC版と統一）
                setTimeout(() => {
                  if (cyRef.current) {
                    cyRef.current.fit(undefined, 20);
                    cyRef.current.center();
                  }
                }, 150); // 遅延を少し長くして確実に実行
              }}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <span className="text-lg font-bold">✕</span>
            </button>
          </div>

          {/* コンテンツ */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* ひとこと定義 */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700">{tagDefinition}</p>
            </div>

            {/* 紐づく困りごと */}
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-2">子（紐づく困りごと）</h3>
              <div className="space-y-2">
                {displayDifficulties.map((difficulty: DifficultyData) => {
                  const mainTags = difficulty['主要タグ'] ? difficulty['主要タグ'].split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0) : [];
                  const subTags = difficulty['補助タグ'] ? difficulty['補助タグ'].split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0) : [];
                  const currentSelectedTags = selectedTags as unknown as string[];
                  
                  // 全てのタグを表示（core + sub）
                  const allTags = [
                    ...mainTags.map(tag => ({ tag, type: 'core' as const })),
                    ...subTags.map(tag => ({ tag, type: 'sub' as const }))
                  ];
                  
                  return (
                    <div key={difficulty['困りごと内容']} className="p-3 bg-white border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium text-gray-800">
                              {difficulty['困りごと内容']}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {!showAllDifficulties && sortedDifficulties.length > 6 && (
                <button
                  onClick={() => setShowAllDifficulties(true)}
                  className="w-full mt-2 py-2 text-sm text-teal-600 hover:text-teal-800"
                >
                  すべて表示
                </button>
              )}
            </div>

            {/* 共起タグ */}
            {topCooccurrenceTags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-800 mb-2">一緒に出やすいタグ（共起）</h3>
                <div className="flex flex-wrap gap-2">
                  {topCooccurrenceTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagSelect(tag)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200"
                    >
                      {tag}｜{getTagName(tag)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* つながり理由 */}
            <div className="bg-teal-50 p-3 rounded-lg">
              <p className="text-xs text-teal-700">
                このタグ経由で現在の選択と繋がるノード：{uniqueDifficulties.length}件
              </p>
            </div>
          </div>

        </div>
      </div>
    );
  };

  // 困りごと詳細モーダル
  const renderDifficultyModal = () => {
    if (!selectedNode) return null;

    const difficultyData = graphData.nodes.find(node => 
      node.data.id === selectedNode
    )?.data.difficultyData;

    if (!difficultyData) return null;

    // ドメインに応じた具体例を選択
    let specificExample = '';
    if (domain?.name === '企業') {
      specificExample = difficultyData['企業具体例'];
    } else if (domain?.name === '教育機関') {
      specificExample = difficultyData['教育機関具体例'];
    } else if (domain?.name === '支援機関') {
      specificExample = difficultyData['支援機関具体例'];
    }

    const exampleList = specificExample.split(',').map((example, index) => (
      <li key={index} className="text-sm text-gray-500 mb-1">
        {example.trim()}
      </li>
    ));

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
          {/* モーダルヘッダー */}
          <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedNode}
            </h3>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-white bg-teal-500 hover:bg-teal-600 transition-colors text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full"
            >
              ✕
            </button>
          </div>
          
          {/* モーダルコンテンツ */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">カテゴリ</h4>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                {difficultyData['カテゴリ']}
              </span>
            </div>
            
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">具体例</h4>
              <ul className="list-disc pl-4 text-sm text-gray-500">
                {exampleList}
              </ul>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">タグ</h4>
              <div className="flex flex-wrap gap-1">
                {difficultyData['主要タグ'] && difficultyData['主要タグ'].split(',').map((tag: string, index: number) => {
                  const tagName = tag.trim();
                  const isSelected = Array.isArray(selectedTags) && selectedTags.includes(tagName);
                  return (
                    <span 
                      key={`main-${index}`} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-300"
                    >
                      主：{tagName}
                      {isSelected && <span className="ml-1 text-xs">★</span>}
                    </span>
                  );
                })}
                {difficultyData['補助タグ'] && difficultyData['補助タグ'].split(',').map((tag: string, index: number) => {
                  const tagName = tag.trim();
                  const isSelected = Array.isArray(selectedTags) && selectedTags.includes(tagName);
                  return (
                    <span 
                      key={`sub-${index}`} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-300"
                    >
                      副：{tagName}
                      {isSelected && <span className="ml-1 text-xs">★</span>}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* モーダルフッター */}
          <div className="px-6 py-4 border-t bg-gray-50">
            <button
              onClick={() => setSelectedNode(null)}
              className="w-full px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (selectedDifficulties.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">困りごとを選択するとグラフが表示されます</p>
      </div>
    );
  }

  // グラフデータが空の場合はエラーメッセージを表示
  if (graphData.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">グラフデータが見つかりません</p>
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* トグルボタン */}
      <div className="mb-4 flex justify-center items-center gap-4">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setShowMainTagsOnly(true)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              showMainTagsOnly
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            主要タグのみ
          </button>
          <button
            onClick={() => setShowMainTagsOnly(false)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              !showMainTagsOnly
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            全タグ
          </button>
        </div>
        
      </div>
      
      {/* グラフコンテナ */}
      <div className={`w-full ${isMobile ? 'h-96' : 'h-[600px]'} bg-gray-50 rounded-lg border`}>
        <CytoscapeComponent
          elements={[...graphData.nodes, ...graphData.edges]}
          layout={layout}
          style={{ 
            width: '100%', 
            height: '100%',
            ...(isMobile ? {
              display: 'block',
              position: 'relative'
            } : {
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            })
          }}
          cy={(cy: Core) => {
            // cyRefに参照を保存
            cyRef.current = cy;
            // 初期化フラグをリセット
            isInitialized.current = false;
            
            // イベントリスナーを安全に設定（重複を防ぐ）
            try {
              // 既存のイベントリスナーを削除
              cy.off('tap', 'node', handleNodeClick);
              cy.off('mouseover', 'edge', handleEdgeHover);
              cy.off('mouseout', 'edge', handleEdgeLeave);
              cy.off('layoutstop');
              
              // 新しいイベントリスナーを設定
              cy.on('tap', 'node', handleNodeClick);
              cy.on('mouseover', 'edge', handleEdgeHover);
              cy.on('mouseout', 'edge', handleEdgeLeave);
              
              // レイアウト完了後に中央配置を実行
              cy.on('layoutstop', () => {
                setTimeout(() => {
                  // PC版とモバイル版を統一：通常の中央配置
                  cy.fit(undefined, 20);
                  cy.center();
                  // 初期化完了フラグを設定
                  isInitialized.current = true;
                }, 100); // 遅延を少し長くして確実に実行
              });
              
              // ハイライト機能
              if (highlightedTag) {
                cy.elements().removeClass('highlighted faded');
                
                // タグノードをハイライト
                cy.elements(`[tagName="${highlightedTag}"]`).addClass('highlighted');
                
                // 関連する困りごとをハイライト
                cy.elements(`[id*="${highlightedTag}"]`).addClass('highlighted');
                
                // 関連するエッジをハイライト
                cy.elements(`edge[source*="${highlightedTag}"], edge[target*="${highlightedTag}"]`).addClass('highlighted');
                
                // その他の要素をフェード
                cy.elements().not('.highlighted').addClass('faded');
              } else {
                cy.elements().removeClass('highlighted faded');
              }
            } catch (error) {
              console.warn('Cytoscape event setup error:', error);
            }
          }}
          stylesheet={[
            {
              selector: 'node',
              style: {
                'label': 'data(label)',
                'text-valign': 'center',
                'text-halign': 'center',
                'color': '#374151',
                'border-width': 2,
                'border-color': '#9CA3AF',
                'font-size': isMobile ? '8px' : '10px',
                'text-wrap': 'wrap',
                'text-max-width': isMobile ? '60px' : '80px',
                'opacity': 1
              }
            },
            {
              selector: 'node[type="difficulty"]',
              style: {
                'shape': 'ellipse',
                'width': 'data(nodeSize)',
                'height': 'data(nodeSize)',
                'background-color': 'data(categoryColor)'
              }
            },
            {
              selector: 'node[type="difficulty"][isTopHit="true"]',
              style: {
                'opacity': 1,
                'border-width': 3,
                'border-color': '#EF4444',
                'width': 'data(nodeSize)',
                'height': 'data(nodeSize)'
              }
            },
            {
              selector: 'node[type="difficulty"][shouldFade="true"]',
              style: {
                'opacity': 0.3,
                'border-width': 1,
                'border-color': '#9CA3AF'
              }
            },
            {
              selector: 'node[type="tag"]',
              style: {
                'shape': 'diamond',
                'width': 40,
                'height': 40,
                'background-color': TAG_NODE_COLOR,
                'font-size': isMobile ? '8px' : '10px',
                'text-wrap': 'wrap',
                'text-max-width': isMobile ? '60px' : '80px',
                'label': 'data(label)',
                'text-valign': 'center',
                'text-halign': 'center'
              }
            },
            {
              selector: 'node[type="tag"][isSelected="true"]',
              style: {
                'background-color': '#3B82F6',
                'color': '#FFFFFF',
                'border-width': 3,
                'border-color': '#1D4ED8',
                'width': 45,
                'height': 45
              }
            },
            {
              selector: 'node[type="tag"][isDisabled="true"]',
              style: {
                'opacity': 0.3,
                'background-color': '#9CA3AF'
              }
            },
            {
              selector: 'node.highlighted',
              style: {
                'border-color': '#EF4444',
                'border-width': 4,
                'background-color': '#FEF2F2',
                'opacity': 1
              }
            },
            {
              selector: 'node.faded',
              style: {
                'opacity': 0.3
              }
            },
            {
              selector: 'edge[type="difficulty-difficulty"]',
              style: {
                'curve-style': 'bezier',
                'line-color': '#888',
                'width': 'data(weight)',
                'opacity': 0.8,
                'target-arrow-shape': 'none'
              }
            },
            {
              selector: 'edge[type="difficulty-tag"]',
              style: {
                'curve-style': 'bezier',
                'line-color': '#9CA3AF',
                'width': 1,
                'opacity': 0.4,
                'target-arrow-shape': 'triangle',
                'target-arrow-color': '#9CA3AF'
              }
            },
            {
              selector: 'edge.highlighted',
              style: {
                'line-color': '#EF4444',
                'opacity': 1,
                'width': 3
              }
            },
            {
              selector: 'edge.faded',
              style: {
                'opacity': 0.1
              }
            }
          ]}
        />
      </div>
      
      {/* 困りごと詳細モーダル */}
      {renderDifficultyModal()}
      
      {/* タグボトムシート/モーダル */}
      {renderTagBottomSheet()}
      
      {/* ツールチップ */}
      {tooltipContent && tooltipPosition && (
        <div
          className="fixed z-50 px-2 py-1 text-xs bg-gray-800 text-white rounded shadow-lg pointer-events-none"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 30
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default DifficultyGraphView;
