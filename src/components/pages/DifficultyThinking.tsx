import React, { useState, useEffect, useMemo } from 'react';
import { Situation, CharacteristicType, Domain } from '../../types';
// import reasonableAccommodations from '../../data/user/ReasonableAccommodation.json';
import AccommodationDisplay from './AccommodationDisplay';
import { useIsMobile } from '../../hooks/useIsMobile';
import { TAG_MAP, getTagName } from '../../constants/tagMap';
import DifficultyGraphView from '../graph/DifficultyGraphView';
// @ts-ignore
import { loadStore, buildViewModel, buildFilteredViewModel } from '../../data/newDataLoader';
import { ViewModel } from '../../types/newDataStructure';
import { Domain as NewDomain } from '../../types/newDataStructure';

// 8カテゴリ定義
const CATEGORIES = [
  '身体症状・体調',
  '感覚・環境',
  '注意・集中',
  '実行・計画・記憶',
  '感情・ストレス反応',
  'コミュニケーション',
  '生活・変化対応',
  '職場・社会不安'
];

// カテゴリアイコン（ステップ⑤と統一）
const CATEGORY_ICONS = {
  '身体症状・体調': '🏥',
  '感覚・環境': '💡',
  '注意・集中': '🎯',
  '実行・計画・記憶': '📋',
  '感情・ストレス反応': '❤️',
  'コミュニケーション': '💬',
  '生活・変化対応': '🔄',
  '職場・社会不安': '🏢'
};

const SUGGESTS = [
  {
    id: '1',
    title: 'タスクが多すぎて整理できない',
    desc: '"緊急・重要"マトリクスで整理するシートや支援する',
    icon: '📝',
    category: '実行機能'
  },
  {
    id: '2',
    title: '注意されると強いストレス',
    desc: '注意や指導の前後で、本人の状況に応じた十分なサポートとフォローを実施する',
    icon: '😨',
    category: '対人関係'
  },
  {
    id: '3',
    title: '午後に強い眠気が来て作業効率が大きく下がる',
    desc: '眠気時間帯に打ち合わせを避け、15〜20分のパワーナップを推奨する',
    icon: '😪',
    category: '体調管理'
  },
  {
    id: '4',
    title: 'リモートワーク時の孤独感や不安',
    desc: '定期的なオンラインの1on1の実施により、個別のコミュニケーション機会を確保する',
    icon: '🧑‍💻',
    category: '対人関係'
  },
  {
    id: '5',
    title: '曖昧な指示に混乱する',
    desc: '具体的な数値や期限を明確に示し、理解度を確認する機会を設ける',
    icon: '❓',
    category: 'コミュニケーション'
  },
  {
    id: '6',
    title: '作業の切り替えが苦手',
    desc: '作業間の決まった切り替え手順を作成し、視覚的なリマインダーを活用する',
    icon: '🔄',
    category: '実行機能'
  }
];

type DifficultyItem = {
  id: string;
  title: string;
  icon: string;
  cares: any[];
};

type SituationItem = {
  domainId: string;
  situationId: string;
};

type DifficultyThinkingProps = {
  characteristics: CharacteristicType[];
  domain: Domain;
  situations: Situation[];
  onComplete: (difficulties: DifficultyItem[]) => void;
  selectedDifficulties: any[];
  onBack: () => void;
  onViewModelChange?: (viewModel: ViewModel | null | undefined) => void;
};

const DifficultyThinking: React.FC<DifficultyThinkingProps> = ({
  characteristics,
  domain,
  situations,
  onComplete,
  selectedDifficulties,
  onBack,
  onViewModelChange
}) => {
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [viewModel, setViewModel] = useState<ViewModel | null | undefined>(null);
  const [customDifficulties, setCustomDifficulties] = useState<string[]>([]);
  const [showAccommodationDisplay, setShowAccommodationDisplay] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('身体症状・体調'); // デフォルトカテゴリ
  const [isCountAnimating, setIsCountAnimating] = useState(false); // カウントアニメーション用
  const [isMaxReached, setIsMaxReached] = useState(false); // 最大選択数達成時のアニメーション用
  const [isCountDecreasing, setIsCountDecreasing] = useState(false); // カウント減少時のアニメーション用
  const [bigNumber, setBigNumber] = useState<number | null>(null); // 大きな数字表示用
  const [isBigNumberAnimating, setIsBigNumberAnimating] = useState(false); // 大きな数字のアニメーション用
  const [isHidingCurrent, setIsHidingCurrent] = useState(false); // 現在の表示を一時的に隠す用
  const [isDecreasingNumber, setIsDecreasingNumber] = useState<number | null>(null); // 減少時の数字表示用
  const [isDecreasingAnimating, setIsDecreasingAnimating] = useState(false); // 減少時のアニメーション用
  const [showSelectionModal, setShowSelectionModal] = useState(false); // 選択済み困りごとモーダル表示用
  const [viewMode, setViewMode] = useState<'list' | 'graph'>('list'); // ビューモード（リスト or グラフ）
  const [deselectedCard, setDeselectedCard] = useState<string | null>(null); // 選択解除されたカード
  const [isDeckAnimating, setIsDeckAnimating] = useState(false); // カードの束のアニメーション
  const [isDeckAdding, setIsDeckAdding] = useState(false); // カードの束に追加するアニメーション
  const [addingCard, setAddingCard] = useState<{id: string, title: string, category: string} | null>(null); // 追加されるカード
  const [removingCard, setRemovingCard] = useState<{id: string, title: string, category: string} | null>(null); // 削除されるカード
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [visibleCounts, setVisibleCounts] = useState<{[key: string]: number}>({});
  
  // 数値に応じた色を決定する関数
  const getBigNumberColor = (num: number) => {
    if (num >= 11) return 'text-red-500'; // 11以降はビビットな赤（超えてますよ！）
    if (num === 10) return 'text-orange-500'; // 10はオレンジ
    return 'text-yellow-500'; // 1-9はイエロー系
  };

  // カテゴリのアイコンを取得する関数
  const getCategoryIcon = (category: string) => {
    const CATEGORY_ICONS = {
      '身体症状・体調': '🏥',
      '感覚・環境': '💡',
      '注意・集中': '🎯',
      '実行・計画・記憶': '📋',
      '感情・ストレス反応': '❤️',
      'コミュニケーション': '💬',
      '生活・変化対応': '🔄',
      '職場・社会不安': '🏢'
    };
    return CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || '🎯';
  };

  // アコーディオンを開閉する関数
  const toggleAccordion = (cardTitle: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardTitle)) {
        newSet.delete(cardTitle);
      } else {
        newSet.add(cardTitle);
      }
      return newSet;
    });
  };

  // さらに表示する関数
  const showMore = (category: string, totalCount: number) => {
    console.log('showMore called:', { category, totalCount, currentVisible: visibleCounts[category], expandedCards: Array.from(expandedCards) });
    setVisibleCounts(prev => {
      const newCount = Math.min((prev[category] || 4) + 4, totalCount);
      console.log('Setting visible count:', { category, newCount });
      return {
        ...prev,
        [category]: newCount
      };
    });
  };

  // 表示件数を取得する関数
  const getVisibleCount = (category: string, totalCount: number) => {
    const count = visibleCounts[category] || Math.min(4, totalCount);
    console.log('getVisibleCount:', { category, totalCount, visibleCounts, result: count });
    return count;
  };
  
  const isMobile = useIsMobile();

  // ③ページから戻ってきた際に選択状態を復元
  // ただし、①から②に画面遷移する際は選択状態をクリア
  useEffect(() => {
    // ①から②への遷移時は全ての状態を完全にクリア
    if (!selectedDifficulties || selectedDifficulties.length === 0) {
      setSelected([]);
      setCustomDifficulties([]);
      setInput('');
      setSelectedCategory('身体症状・体調');
      setShowAccommodationDisplay(false);
    } else {
      // ③ページから戻ってきた場合は選択状態を復元
      const selectedTitles = selectedDifficulties.map(d => d.title);
      setSelected(selectedTitles);
    }
  }, [selectedDifficulties]);



  // コンポーネントのアンマウント時にクリーンアップ
  useEffect(() => {
    return () => {
      // メモリリークを防ぐためのクリーンアップ
      setSelected([]);
      setCustomDifficulties([]);
      setInput('');
      setShowAccommodationDisplay(false);
    };
  }, []);

  // --- フィルタロジック ---
  // 選択特性名リスト
  const selectedCharacteristicNames = characteristics.map(c => c.name);
  // 選択ドメイン名
  const selectedDomainName = domain?.name;
  // 選択場面名リスト
  const selectedSituationNames = situations.map(s => s.name);

  // 新データ構造を読み込む（指定された流れを使用）
  useEffect(() => {
    const loadNewData = async () => {
      try {
        const query = {
          traits: selectedCharacteristicNames,
          domain: selectedDomainName || '企業',
          situations: selectedSituationNames
        };
        
        const vm = await buildFilteredViewModel(query);
        setViewModel(vm);
        onViewModelChange?.(vm);
        // console.log('新データ構造の読み込み成功（フィルタ済み）:', vm);
      } catch (error) {
        console.error('新データ構造の読み込みに失敗:', error);
        setViewModel(null);
      }
    };
    loadNewData();
  }, [characteristics, domain, situations]); // 依存配列を修正

  // フィルタ済み困りごと（新データ構造対応）
  const filteredDifficulties = useMemo(() => {
    if (!viewModel) return [];
    
    // buildFilteredViewModelで既にフィルタリング済みなので、そのまま使用
    return viewModel.map((vm: any) => ({
      '困りごと内容': vm.concern.title,
      'カテゴリ': vm.concern.category,
      '主要タグ': vm.concern.primary_tags.join(','),
      '補助タグ': vm.concern.secondary_tags.join(','),
      '特性タイプ': vm.concern.trait_types.join(','),
      'ドメイン': Object.keys(vm.concern.contexts).join(','),
      '企業でのシチュエーション': vm.concern.contexts['企業']?.join(',') || '',
      '教育機関でのシチュエーション': vm.concern.contexts['教育機関']?.join(',') || '',
      '支援機関でのシチュエーション': vm.concern.contexts['支援機関']?.join(',') || '',
      '企業具体例': vm.concern.examples['企業']?.join(',') || '',
      '教育機関具体例': vm.concern.examples['教育機関']?.join(',') || '',
      '支援機関具体例': vm.concern.examples['支援機関']?.join(',') || '',
    }));
  }, [viewModel]);

  // 困りごと内容で重複排除
  const uniqueDifficulties = useMemo(() => {
  const uniqueDifficultiesMap = new Map<string, any>();
  filteredDifficulties.forEach((item: any) => {
    if (!uniqueDifficultiesMap.has(item['困りごと内容'])) {
      uniqueDifficultiesMap.set(item['困りごと内容'], item);
    }
  });
    return Array.from(uniqueDifficultiesMap.values());
  }, [filteredDifficulties]);

  // 選択状態の管理 - selectedDifficultiesの変更を監視
  useEffect(() => {
    if (selectedDifficulties && selectedDifficulties.length > 0) {
      // ③から戻ってきた場合は選択状態を復元
      const selectedTitles = selectedDifficulties.map(d => d.title);
      setSelected(selectedTitles);
    } else {
      // ①から②への遷移時は選択状態をクリア
      setSelected([]);
    }
  }, [selectedDifficulties]);

  // カテゴリ別に困りごとをグループ化
  const difficultiesByCategory = useMemo(() => {
    return uniqueDifficulties.reduce((acc, item) => {
      const jsonCategory = item['カテゴリ'] || 'その他';
      
      // JSONのカテゴリ名と表示用カテゴリ名のマッピング
      const categoryMapping: { [key: string]: string } = {
        '生活・変化対応': '生活・変化対応'
      };
      
      const displayCategory = categoryMapping[jsonCategory] || jsonCategory;
      
      if (!acc[displayCategory]) {
        acc[displayCategory] = [];
      }
      acc[displayCategory].push(item);
      return acc;
    }, {} as { [key: string]: any[] });
  }, [uniqueDifficulties]);

  // 選択されたカテゴリの困りごと
  // 選択されたカテゴリに困りごとがない場合は、最初の有効なカテゴリを選択
  const availableCategories = useMemo(() => {
    return Object.keys(difficultiesByCategory).filter(category => 
      difficultiesByCategory[category] && difficultiesByCategory[category].length > 0
    );
  }, [difficultiesByCategory]);
  
  // 選択されたカテゴリが有効でない場合は、最初の有効なカテゴリに変更
  useEffect(() => {
    if (availableCategories.length > 0 && !availableCategories.includes(selectedCategory)) {
      setSelectedCategory(availableCategories[0]);
    }
  }, [availableCategories, selectedCategory]);
  
  const currentCategoryDifficulties = useMemo(() => {
    return difficultiesByCategory[selectedCategory] || [];
  }, [difficultiesByCategory, selectedCategory]);

  // --- 選択・追加ロジックは従来通り ---
  const maxSelectable = Infinity; // 制限なし
  const handleSelect = (content: string, event?: React.MouseEvent) => {
    setSelected(prev => {
      if (prev.includes(content)) {
        // 選択解除時のカードアニメーション
        setDeselectedCard(content);
        setTimeout(() => {
          setDeselectedCard(null);
        }, 300);
        
        // カードの束のアニメーション
        if (viewMode === 'list') {
          const cardId = `${content}-${Date.now()}`;
          // カテゴリ情報を取得
          const difficultyItem = uniqueDifficulties.find(item => item['困りごと内容'] === content);
          const category = difficultyItem ? difficultyItem['カテゴリ'] : 'その他';
          
          setRemovingCard({ id: cardId, title: content, category });
          setIsDeckAnimating(true);
          
          setTimeout(() => {
            setRemovingCard(null);
            setIsDeckAnimating(false);
          }, 600);
        }
        
        // 選択を解除（減らす）場合、アニメーションをトリガー
        setIsCountDecreasing(true);
        
        // 減少時のアニメーション処理
        setIsDecreasingNumber(prev.length - 1);
        setIsHidingCurrent(true);
        
        // 少し待ってから大きな数字を表示
        setTimeout(() => {
          setIsDecreasingAnimating(true);
          // アニメーション完了後に要素を削除し、現在の表示を復活
          setTimeout(() => {
            setIsDecreasingNumber(null);
            setIsDecreasingAnimating(false);
            setIsHidingCurrent(false);
          }, 800);
        }, 100);
        
        // 減少アニメーション終了後に状態をリセット
        setTimeout(() => setIsCountDecreasing(false), 600);
        return prev.filter(s => s !== content);
      } else if (prev.length < maxSelectable) {
        // カードの束に追加するアニメーション
        if (viewMode === 'list') {
          const cardId = `${content}-${Date.now()}`;
          // カテゴリ情報を取得
          const difficultyItem = uniqueDifficulties.find(item => item['困りごと内容'] === content);
          const category = difficultyItem ? difficultyItem['カテゴリ'] : 'その他';
          
          setAddingCard({ id: cardId, title: content, category });
          setIsDeckAdding(true);
          
          setTimeout(() => {
            setAddingCard(null);
            setIsDeckAdding(false);
          }, 800);
        }
        
        // 選択数が増える場合、アニメーションをトリガー
        setIsCountAnimating(true);
        
        // 現在の表示を一時的に隠す
        setIsHidingCurrent(true);
        
        // 少し待ってから大きな数字を表示
        setTimeout(() => {
          setBigNumber(prev.length + 1);
          // さらに少し待ってからアニメーション開始
          setTimeout(() => {
            setIsBigNumberAnimating(true);
            // アニメーション完了後に要素を削除し、現在の表示を復活
            setTimeout(() => {
              setBigNumber(null);
              setIsBigNumberAnimating(false);
              setIsHidingCurrent(false);
            }, 800);
          }, 200);
        }, 100);
        
        // 10/10になる瞬間を検知
        if (prev.length === 9) {
          setIsMaxReached(true);
          // 最大達成アニメーション終了後に状態をリセット
          setTimeout(() => setIsMaxReached(false), 800);
        }
        
        // アニメーション終了後に状態をリセット
        setTimeout(() => setIsCountAnimating(false), 600);
        return [...prev, content];
      } else {
        return prev;
      }
    });
  };

  const handleAddCustom = () => {
    if (input.trim() && !customDifficulties.includes(input.trim())) {
      setCustomDifficulties(prev => [...prev, input.trim()]);
      setInput('');
    }
  };

  const handleRemoveCustom = (difficulty: string) => {
    setCustomDifficulties(prev => prev.filter(d => d !== difficulty));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCustom();
    }
  };

  const handleNext = () => {
    const selectedDifficulties = uniqueDifficulties
      .filter(d => selected.includes(d['困りごと内容']))
      .map((d, index) => ({
        id: String(index + 1),
        title: d['困りごと内容'],
        icon: d['アイコン'] || '📝',
        cares: [],
        accommodations: [
          {
            name: '配慮案A',
            description: d['配慮内容'],
            examples: {
              workplace: d['企業の具体的配慮例'],
              education: d['教育機関の具体的配慮例'],
              support: d['支援機関の具体的配慮例']
            }
          }
        ].filter(acc => acc.description)
      }));

    const customDifficultiesWithIds = customDifficulties.map((d, index) => ({
      id: `custom-${index + 1}`,
      title: d,
      category: 'その他',
      icon: '📝',
      cares: [],
      accommodations: []
    }));

    // 選択された困りごとをオブジェクト形式に変換
    const selectedDifficultiesWithDetails = selectedDifficulties.map(difficulty => {
      const difficultyItem = uniqueDifficulties.find(item => item['困りごと内容'] === difficulty.title);
      return {
        id: difficulty.id,
        title: difficulty.title,
        category: difficultyItem ? difficultyItem['カテゴリ'] : 'その他',
        icon: difficulty.icon,
        cares: difficulty.cares,
        accommodations: difficulty.accommodations
      };
    });
    
    onComplete([...selectedDifficultiesWithDetails, ...customDifficultiesWithIds]);
  };

  // SUGGESTSの代わりにselectedDifficultiesを使う
  const difficultiesToShow = selectedDifficulties && selectedDifficulties.length > 0 ? selectedDifficulties : SUGGESTS;

  const handleRestart = () => {
    setShowAccommodationDisplay(false);
    setSelected([]);
    setCustomDifficulties([]);
  };

  const handleBack = () => {
    setShowAccommodationDisplay(false);
    setSelectedDomain(null);
  };

  // カテゴリタブのレンダリング
  const renderCategoryTabs = () => {
    if (isMobile) {
      return (
        <div className="grid grid-cols-2 gap-2 mb-6">
          {CATEGORIES.map(category => {
            const count = difficultiesByCategory[category]?.length || 0;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                disabled={count === 0}
                className={`px-3 py-2 text-sm rounded-lg border transition ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : count === 0
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50'
                }`}
              >
                {CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS]} {category} ({selected.filter(item => difficultiesByCategory[category]?.some((d: any) => d['困りごと内容'] === item)).length}/{count})
              </button>
            );
          })}
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(category => {
          const count = difficultiesByCategory[category]?.length || 0;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              disabled={count === 0}
              className={`px-4 py-2 text-sm rounded-lg border transition ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : count === 0
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50'
              }`}
            >
              {CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS]} {category} ({selected.filter(item => difficultiesByCategory[category]?.some((d: any) => d['困りごと内容'] === item)).length}/{count})
            </button>
          );
        })}
      </div>
    );
  };


  // モバイル用UI
  if (isMobile) {
    return (
      <div className="max-w-none mx-auto p-4 relative">
        {/* CSSアニメーション */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes flyToDeck {
              0% {
                transform: translate(0, 0) scale(1) rotate(0deg);
                opacity: 1;
              }
              25% {
                transform: translate(calc(100vw - 300px), calc(100vh - 400px)) scale(0.9) rotate(45deg);
                opacity: 0.9;
              }
              50% {
                transform: translate(calc(100vw - 200px), calc(100vh - 250px)) scale(0.7) rotate(90deg);
                opacity: 0.8;
              }
              75% {
                transform: translate(calc(100vw - 100px), calc(100vh - 120px)) scale(0.4) rotate(180deg);
                opacity: 0.6;
              }
              100% {
                transform: translate(calc(100vw - 60px), calc(100vh - 60px)) scale(0.1) rotate(270deg);
                opacity: 0;
              }
            }
            @keyframes deselectBounce {
              0% {
                transform: scale(1) rotate(0deg);
                background: linear-gradient(to bottom right, rgb(239 246 255), rgb(219 234 254));
                border-color: rgb(129 140 248);
              }
              25% {
                transform: scale(0.95) rotate(-2deg);
                background: linear-gradient(to bottom right, rgb(254 242 242), rgb(252 231 243));
                border-color: rgb(239 68 68);
              }
              50% {
                transform: scale(1.05) rotate(2deg);
                background: linear-gradient(to bottom right, rgb(254 242 242), rgb(252 231 243));
                border-color: rgb(239 68 68);
              }
              75% {
                transform: scale(0.98) rotate(-1deg);
                background: linear-gradient(to bottom right, rgb(254 242 242), rgb(252 231 243));
                border-color: rgb(239 68 68);
              }
              100% {
                transform: scale(1) rotate(0deg);
                background: linear-gradient(to bottom right, rgb(255 255 255), rgb(255 255 255));
                border-color: rgb(209 213 219);
              }
            }
            @keyframes deckRemove {
              0% {
                transform: scale(1) translateY(0px);
                opacity: 1;
              }
              20% {
                transform: scale(1.1) translateY(-5px);
                opacity: 0.9;
              }
              40% {
                transform: scale(0.9) translateY(2px);
                opacity: 0.8;
              }
              60% {
                transform: scale(1.05) translateY(-2px);
                opacity: 0.9;
              }
              80% {
                transform: scale(0.95) translateY(1px);
                opacity: 0.95;
              }
              100% {
                transform: scale(1) translateY(0px);
                opacity: 1;
              }
            }
            @keyframes deckAdd {
              0% {
                transform: scale(1) translateY(0px);
                opacity: 1;
              }
              25% {
                transform: scale(1.2) translateY(-10px);
                opacity: 0.8;
              }
              50% {
                transform: scale(0.8) translateY(5px);
                opacity: 0.9;
              }
              75% {
                transform: scale(1.1) translateY(-3px);
                opacity: 0.95;
              }
              100% {
                transform: scale(1) translateY(0px);
                opacity: 1;
              }
            }
            @keyframes cardSlideIn {
              0% {
                transform: translate(-100px, -50px) rotate(-15deg) scale(0.8);
                opacity: 0;
              }
              50% {
                transform: translate(-20px, -20px) rotate(-5deg) scale(0.9);
                opacity: 0.8;
              }
              100% {
                transform: translate(0, 0) rotate(0deg) scale(1);
                opacity: 0;
              }
            }
            @keyframes cardSlideOut {
              0% {
                transform: translate(0, 0) rotate(0deg) scale(1);
                opacity: 0.8;
              }
              50% {
                transform: translate(-30px, -30px) rotate(-10deg) scale(0.9);
                opacity: 0.6;
              }
              100% {
                transform: translate(-100px, -50px) rotate(-20deg) scale(0.7);
                opacity: 0;
              }
            }
          `
        }} />
        {/* 選択件数固定表示 - カードの束（リスト表示時のみ） */}
        {viewMode === 'list' && (
          <div className="fixed bottom-0 right-0 z-50">
            <div className="relative w-[120px] h-[120px]">
              {/* カードの束の背景 */}
              <div 
                className="absolute bottom-2 right-2 w-16 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg shadow-lg transform rotate-3"
                style={isDeckAnimating ? { animation: 'deckRemove 0.4s ease-in-out' } : isDeckAdding ? { animation: 'deckAdd 0.5s ease-in-out' } : {}}
              ></div>
              <div 
                className="absolute bottom-3 right-3 w-16 h-20 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg shadow-md transform rotate-1"
                style={isDeckAnimating ? { animation: 'deckRemove 0.4s ease-in-out 0.05s' } : isDeckAdding ? { animation: 'deckAdd 0.5s ease-in-out 0.05s' } : {}}
              ></div>
              <div 
                className="absolute bottom-4 right-4 w-16 h-20 bg-gradient-to-br from-indigo-300 to-indigo-500 rounded-lg shadow-sm transform -rotate-1"
                style={isDeckAnimating ? { animation: 'deckRemove 0.4s ease-in-out 0.1s' } : isDeckAdding ? { animation: 'deckAdd 0.5s ease-in-out 0.1s' } : {}}
              ></div>
              <div 
                className="absolute bottom-5 right-5 w-16 h-20 bg-gradient-to-br from-indigo-200 to-indigo-400 rounded-lg transform -rotate-2"
                style={isDeckAnimating ? { animation: 'deckRemove 0.4s ease-in-out 0.15s' } : isDeckAdding ? { animation: 'deckAdd 0.5s ease-in-out 0.15s' } : {}}
              ></div>
              
              {/* 追加されるカードのアニメーション */}
              {addingCard && (
                <div
                  className="absolute bottom-2 right-2 w-16 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-300 rounded-lg shadow-lg z-10"
                  style={{ animation: 'cardSlideIn 0.8s ease-in-out forwards' }}
                >
                  <div className="p-2 h-full flex flex-col justify-center items-center">
                    <div className="text-lg mb-1">{getCategoryIcon(addingCard.category)}</div>
                    <div className="text-xs text-gray-800 text-center leading-tight">
                      {addingCard.title.length > 8 ? addingCard.title.substring(0, 8) + '...' : addingCard.title}
                    </div>
                  </div>
                </div>
              )}
              
              {/* 削除されるカードのアニメーション */}
              {removingCard && (
                <div
                  className="absolute bottom-2 right-2 w-16 h-20 bg-gradient-to-br from-red-50 to-pink-100 border-2 border-red-300 rounded-lg shadow-lg z-10"
                  style={{ animation: 'cardSlideOut 0.6s ease-in-out forwards' }}
                >
                  <div className="p-2 h-full flex flex-col justify-center items-center">
                    <div className="text-lg mb-1">{getCategoryIcon(removingCard.category)}</div>
                    <div className="text-xs text-gray-800 text-center leading-tight">
                      {removingCard.title.length > 8 ? removingCard.title.substring(0, 8) + '...' : removingCard.title}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* 3/10テキスト表示 - カードの束の上に表示（リスト表示時のみ） */}
        {viewMode === 'list' && (
          <div className="fixed bottom-6 right-6 z-[60]">
          <div 
            className="text-lg font-bold cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setShowSelectionModal(true)}
          >
            {/* 数字部分 */}
            <span className={`transition-all duration-800 ease-out ${
              isHidingCurrent && bigNumber
                ? `opacity-100 text-5xl ${getBigNumberColor(bigNumber)} drop-shadow-2xl`
                : isHidingCurrent && isDecreasingNumber
                  ? 'opacity-100 text-5xl text-blue-300 drop-shadow-2xl'
                : isHidingCurrent && !bigNumber && !isDecreasingNumber
                  ? 'opacity-0'
                  : isMaxReached
                    ? 'scale-150 text-red-500 drop-shadow-2xl animate-pulse'
                    : isCountAnimating 
                      ? 'scale-125 text-yellow-300 drop-shadow-lg' 
                      : isCountDecreasing
                        ? 'scale-75 text-blue-300 drop-shadow-sm animate-bounce'
                        : bigNumber && !isBigNumberAnimating
                          ? `text-5xl ${getBigNumberColor(bigNumber)} drop-shadow-2xl`
                          : bigNumber && isBigNumberAnimating
                            ? `text-lg ${getBigNumberColor(bigNumber)}`
                                                            : isDecreasingNumber && !isDecreasingAnimating
                                  ? 'text-5xl text-blue-300 drop-shadow-2xl'
                                  : isDecreasingNumber && isDecreasingAnimating
                                    ? 'text-lg text-blue-300'
                                    : selected.length >= 11
                                      ? 'text-red-500 scale-100'
                                      : 'text-white scale-100'
            }`}>
              {isHidingCurrent && bigNumber ? bigNumber : isHidingCurrent && isDecreasingNumber ? isDecreasingNumber : selected.length}
            </span>
            {/* /10部分 - 常に表示、大きな数字表示中は色を統一 */}
            <span className={`transition-all duration-300 ${
              bigNumber ? getBigNumberColor(bigNumber).replace('text-red-500', 'text-red-300').replace('text-orange-500', 'text-orange-300').replace('text-yellow-500', 'text-yellow-300') : isDecreasingNumber ? 'text-blue-300' : 'text-white'
            }`}>枚</span>
          </div>
        </div>
        )}
        

        {/* 選択済み困りごとモーダル */}
        {showSelectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
              {/* モーダルヘッダー */}
              <div className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  選択済みの困りごとリスト
                  <span className={selected.length >= 11 ? 'text-red-500' : 'text-white'}>
                    （{selected.length}件）
                  </span>
                </h3>
                <button 
                  onClick={() => setShowSelectionModal(false)}
                  className="text-white hover:text-gray-200 transition-colors text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full bg-indigo-500 hover:bg-indigo-600"
                >
                  ✕
                </button>
              </div>
              
              {/* モーダルコンテンツ */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {selected.length === 0 ? (
                  <p className="text-gray-500 text-center">選択された困りごとはありません</p>
                ) : (
                  <div className="space-y-3">
                    {/* 全て削除ボタン */}
                    <div className="mb-4">
                      <button
                        onClick={() => {
                          // 全ての選択を解除
                          selected.forEach(item => handleSelect(item));
                          // モーダルを閉じる
                          setTimeout(() => setShowSelectionModal(false), 100);
                        }}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        全て削除 ({selected.length}件)
                      </button>
                    </div>
                    
                    {/* 個別削除リスト */}
                    <div className="space-y-3">
                      {selected.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700 flex-1">{item}</span>
                          <button
                            onClick={() => {
                              handleSelect(item); // 選択解除（モーダルは閉じない）
                            }}
                            className="ml-3 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                          >
                            削除
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* モーダルフッター */}
              <div className="px-6 py-4 border-t bg-gray-50">
                <button
                  onClick={() => setShowSelectionModal(false)}
                  className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}
        
        
        {/* 説明文 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-gray-700 text-base leading-relaxed">
            🔍 ここからは「困りごとの地図」を広げていきます。<br />
            当てはまるカードをタップして集め、自分のコレクションに追加してください。集めたカードは整理でき、🔗グラフ表示で関連性が可視化されていきます。
          </p>
        </div>
        
        {/* ビューモード切り替えタブ */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-3">
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📋 リスト表示
            </button>
            <button
              onClick={() => setViewMode('graph')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'graph'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🔗 グラフ表示
            </button>
          </div>
          <button
            onClick={() => setShowSelectionModal(true)}
            className="w-full py-2.5 px-4 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            📚 コレクション ({selected.length}枚)
          </button>
        </div>
        
        <div className="space-y-4">
          {viewMode === 'list' ? (
            <>
              {/* カテゴリタブ */}
              {renderCategoryTabs()}

        {/* フィルタされた困りごとカード */}
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  {selectedCategory}でこんな困りごとはありませんか？（{selected.filter(item => currentCategoryDifficulties.some((d: any) => d['困りごと内容'] === item)).length}/{currentCategoryDifficulties.length}）
                </h3>
                <div className="text-sm text-gray-500 mb-2 text-right">
                  候補の困りごと: {currentCategoryDifficulties.length}件
                </div>
                <div className="grid grid-cols-1 gap-4 content-start">
                  {currentCategoryDifficulties.length === 0 && (
                    <div className="text-gray-400">このカテゴリには該当する困りごとは見つかりませんでした。</div>
                  )}
                  {currentCategoryDifficulties.slice(0, getVisibleCount(selectedCategory, currentCategoryDifficulties.length)).map((item: any) => {
              const isSelected = selected.includes(item['困りごと内容']);
              const isDisabled = !isSelected && selected.length >= maxSelectable;
                    
                    // ドメインに応じた具体例を選択
                    let specificExample = '';
                    if (domain?.name === '企業') {
                      specificExample = item['企業具体例'];
                    } else if (domain?.name === '教育機関') {
                      specificExample = item['教育機関具体例'];
                    } else if (domain?.name === '支援機関') {
                      specificExample = item['支援機関具体例'];
                    }

                    // 具体例をカンマで分割してリスト化
                    const exampleList = specificExample.split(',').map((example, index) => (
                      <li key={index} className="text-sm text-gray-500 mb-1">
                        {example.trim()}
                      </li>
                    ));

                    // タグ情報を取得
                    const mainTags = item['主要タグ'] ? item['主要タグ'].split(',').map((tag: string) => tag.trim()) : [];
                    const subTags = item['補助タグ'] ? item['補助タグ'].split(',').map((tag: string) => tag.trim()) : [];

              const isExpanded = expandedCards.has(item['困りごと内容']);

              return (
                <div
                  key={item['困りごと内容']}
                  className={`rounded-xl border-2 transition-all duration-300 w-full ${
                    isExpanded 
                      ? 'shadow-md' 
                      : 'shadow-sm hover:shadow-md'
                  } ${
                    isSelected
                      ? 'border-indigo-400 bg-gradient-to-br from-indigo-50 to-blue-100 shadow-lg transform scale-[1.02]'
                      : 'border-gray-200 bg-gradient-to-br from-gray-50 to-white hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-white'
                  } ${isDisabled ? 'opacity-40' : ''}`}
                  style={{
                    backgroundImage: isSelected ? undefined : 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0) !important',
                    backgroundSize: '20px 20px',
                    animation: deselectedCard === item['困りごと内容'] ? 'deselectBounce 0.3s ease-in-out' : undefined
                  }}
                >
                  {/* カードのヘッダー部分（選択可能） */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={(e) => handleSelect(item['困りごと内容'], e)}
                        disabled={isDisabled}
                        className={`flex-1 text-left transition ${
                          isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{item['困りごと内容']}</span>
                          {isSelected && (
                            <div className="ml-auto">
                              <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </button>
                      
                      {/* 詳細表示ボタン（右端） */}
                      <button
                        onClick={() => toggleAccordion(item['困りごと内容'])}
                        className="ml-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 rounded hover:bg-blue-50"
                      >
                        <span className="transition-all duration-200">
                          {isExpanded ? '▲' : '▼'}
                        </span>
                        <span className="text-xs">{isExpanded ? '閉じる' : '詳細'}</span>
                      </button>
                    </div>
                  </div>

                  {/* アコーディオン内容 */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-100 pt-3 bg-gradient-to-b from-transparent to-gray-50/30">
                      <div className="space-y-3">
                        {/* 具体例 */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">具体例</h4>
                          <ul className="list-disc pl-4 text-sm text-gray-500 space-y-1">
                            {exampleList}
                          </ul>
                        </div>

                        {/* タグ表示 */}
                        {(mainTags.length > 0 || subTags.length > 0) && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">関連タグ</h4>
                            <div className="flex flex-wrap gap-1">
                              {/* 主要タグ */}
                              {mainTags.map((tag: string, index: number) => (
                                <span key={`main-${index}`} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  #{tag} : {getTagName(tag)}
                                </span>
                              ))}
                              {/* 補助タグ */}
                              {subTags.map((tag: string, index: number) => (
                                <span key={`sub-${index}`} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                  #{tag} : {getTagName(tag)}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* さらに表示ボタン */}
          {currentCategoryDifficulties.length > getVisibleCount(selectedCategory, currentCategoryDifficulties.length) && (
            <div className="mt-2">
              {/* 区切り線とサブ見出し */}
              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <div className="px-4 text-sm text-gray-500 font-medium">— 他の困りごと —</div>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => showMore(selectedCategory, currentCategoryDifficulties.length)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  残り{currentCategoryDifficulties.length - getVisibleCount(selectedCategory, currentCategoryDifficulties.length)}件を表示
                </button>
              </div>
            </div>
          )}
              </div>

              {/* カスタム困りごと入力 */}
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">その他の困りごとがあれば追加してください（未実装）</h3>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="(未実装)"
                    disabled
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-400"
                  />
                  <button
                    onClick={handleAddCustom}
                    disabled
                    className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg font-medium disabled:cursor-not-allowed"
                  >
                    送信
                  </button>
                </div>
                {customDifficulties.length > 0 && (
                  <div className="space-y-2">
                    {customDifficulties.map((difficulty, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">{difficulty}</span>
                        <button
                          onClick={() => handleRemoveCustom(difficulty)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* グラフ表示 */
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                選択した困りごとの関連性
              </h3>
              <DifficultyGraphView 
                selectedDifficulties={selected}
                domain={domain}
                viewModel={viewModel}
              />
            </div>
          )}
        </div>

        {/* ボタン */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-full bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-colors"
          >
            ⬅️ 前のステップへ
          </button>
          <button
            onClick={handleNext}
            disabled={selected.length === 0}
            className="px-6 py-3 rounded-full bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors disabled:bg-gray-300 disabled:text-gray-400"
          >
            🎮 次のステップへ
          </button>
        </div>
      </div>
    );
  }

  // PC版UI
  return (
    <div className="max-w-none mx-auto p-6 space-y-8">
      {/* CSSアニメーション */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes flyToDeck {
            0% {
              transform: translate(0, 0) scale(1) rotate(0deg);
              opacity: 1;
            }
            50% {
              transform: translate(calc(100vw - 300px), calc(100vh - 300px)) scale(0.8) rotate(180deg);
              opacity: 0.8;
            }
            100% {
              transform: translate(calc(100vw - 200px), calc(100vh - 200px)) scale(0.3) rotate(360deg);
              opacity: 0;
            }
          }
          @keyframes deselectBounce {
            0% {
              transform: scale(1) rotate(0deg);
              background: linear-gradient(to bottom right, rgb(239 246 255), rgb(219 234 254));
              border-color: rgb(129 140 248);
            }
            25% {
              transform: scale(0.95) rotate(-2deg);
              background: linear-gradient(to bottom right, rgb(254 242 242), rgb(252 231 243));
              border-color: rgb(239 68 68);
            }
            50% {
              transform: scale(1.05) rotate(2deg);
              background: linear-gradient(to bottom right, rgb(254 242 242), rgb(252 231 243));
              border-color: rgb(239 68 68);
            }
            75% {
              transform: scale(0.98) rotate(-1deg);
              background: linear-gradient(to bottom right, rgb(254 242 242), rgb(252 231 243));
              border-color: rgb(239 68 68);
            }
            100% {
              transform: scale(1) rotate(0deg);
              background: linear-gradient(to bottom right, rgb(255 255 255), rgb(255 255 255));
              border-color: rgb(209 213 219);
            }
          }
          @keyframes deckRemove {
            0% {
              transform: scale(1) translateY(0px);
              opacity: 1;
            }
            20% {
              transform: scale(1.1) translateY(-5px);
              opacity: 0.9;
            }
            40% {
              transform: scale(0.9) translateY(2px);
              opacity: 0.8;
            }
            60% {
              transform: scale(1.05) translateY(-2px);
              opacity: 0.9;
            }
            80% {
              transform: scale(0.95) translateY(1px);
              opacity: 0.95;
            }
            100% {
              transform: scale(1) translateY(0px);
              opacity: 1;
            }
          }
          @keyframes deckAdd {
            0% {
              transform: scale(1) translateY(0px);
              opacity: 1;
            }
            25% {
              transform: scale(1.2) translateY(-10px);
              opacity: 0.8;
            }
            50% {
              transform: scale(0.8) translateY(5px);
              opacity: 0.9;
            }
            75% {
              transform: scale(1.1) translateY(-3px);
              opacity: 0.95;
            }
            100% {
              transform: scale(1) translateY(0px);
              opacity: 1;
            }
          }
          @keyframes cardSlideIn {
            0% {
              transform: translate(-80px, -40px) rotate(-15deg) scale(0.8);
              opacity: 0;
            }
            50% {
              transform: translate(-15px, -15px) rotate(-5deg) scale(0.9);
              opacity: 0.8;
            }
            100% {
              transform: translate(0, 0) rotate(0deg) scale(1);
              opacity: 0;
            }
          }
          @keyframes cardSlideOut {
            0% {
              transform: translate(0, 0) rotate(0deg) scale(1);
              opacity: 0.8;
            }
            50% {
              transform: translate(-25px, -25px) rotate(-10deg) scale(0.9);
              opacity: 0.6;
            }
            100% {
              transform: translate(-80px, -40px) rotate(-20deg) scale(0.7);
              opacity: 0;
            }
          }
        `
      }} />
      {/* 選択済み困りごとモーダル */}
      {showSelectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* モーダルヘッダー */}
            <div className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                選択済みの困りごとリスト
                <span className={selected.length >= 11 ? 'text-red-500' : 'text-white'}>
                  （{selected.length}件）
                </span>
              </h3>
              <button
                onClick={() => setShowSelectionModal(false)}
                className="text-white hover:text-gray-200 transition-colors text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20"
              >
                ✕
              </button>
            </div>
            
            {/* モーダルコンテンツ */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {selected.length === 0 ? (
                <p className="text-gray-500 text-center">選択された困りごとはありません</p>
              ) : (
                <div className="space-y-3">
                  {/* 全て削除ボタン */}
                  <div className="mb-4">
                    <button
                      onClick={() => {
                        // 全ての選択を解除
                        selected.forEach(item => handleSelect(item));
                        // モーダルを閉じる
                        setTimeout(() => setShowSelectionModal(false), 100);
                      }}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      全て削除 ({selected.length}件)
                    </button>
                  </div>
                  
                  {/* 個別削除リスト */}
                  <div className="space-y-3">
                    {selected.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700 flex-1">{item}</span>
                <button
                          onClick={() => {
                            handleSelect(item); // 選択解除（モーダルは閉じない）
                          }}
                          className="ml-3 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                        >
                          削除
                </button>
                    </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* モーダルフッター */}
            <div className="px-6 py-4 border-t bg-gray-50">
              <button
                onClick={() => setShowSelectionModal(false)}
                className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
            </div>
          )}
      

      
      {/* 説明文 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <p className="text-gray-700 text-lg leading-relaxed">
          🔍 ここからは「困りごとの地図」を広げていきます。<br />
          当てはまるカードをタップして集め、自分のコレクションに追加してください。集めたカードは整理でき、🔗グラフ表示で関連性が可視化されていきます。
        </p>
      </div>
      
      {/* ビューモード切り替えタブ */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📋 リスト表示
            </button>
            <button
              onClick={() => setViewMode('graph')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'graph'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🔗 グラフ表示
            </button>
          </div>
          <button
            onClick={() => setShowSelectionModal(true)}
            className="py-2.5 px-4 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors whitespace-nowrap"
          >
            📚 コレクション ({selected.length}枚)
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {viewMode === 'list' ? (
          <>
            {/* カテゴリタブと選択数表示 */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {renderCategoryTabs()}
              </div>
              <div className="ml-4">
                <div 
                  className={`inline-flex items-center justify-center px-6 py-3 rounded-full shadow-lg transition-all duration-300 cursor-pointer hover:opacity-80 ${
                    isMaxReached
                      ? 'scale-125 bg-red-500 shadow-2xl animate-pulse'
                      : isCountAnimating
                        ? 'scale-110 bg-yellow-500 shadow-xl'
                        : isCountDecreasing
                          ? 'scale-90 bg-blue-400 shadow-sm animate-bounce'
                          : 'bg-indigo-600 scale-100'
                  }`}
                  onClick={() => setShowSelectionModal(true)}
                >
                  <span className="text-lg font-bold text-white">
                    {/* 数字部分 */}
                    <span className={`transition-all duration-800 ease-out ${
                      isHidingCurrent && bigNumber
                        ? `opacity-100 text-6xl ${getBigNumberColor(bigNumber)}`
                        : isHidingCurrent && isDecreasingNumber
                          ? 'opacity-100 text-6xl text-blue-300'
                          : isHidingCurrent && !bigNumber && !isDecreasingNumber
                            ? 'opacity-0' 
                            : bigNumber && !isBigNumberAnimating
                              ? `text-6xl ${getBigNumberColor(bigNumber)}`
                              : bigNumber && isBigNumberAnimating
                                ? `text-lg ${getBigNumberColor(bigNumber)}`
                                : isDecreasingNumber && !isDecreasingAnimating
                                  ? 'text-6xl text-blue-300'
                                  : isDecreasingNumber && isDecreasingAnimating
                                    ? 'text-lg text-blue-300'
                                    : selected.length >= 11
                                      ? 'text-red-500 opacity-100'
                                      : 'opacity-100'
                    }`}>
                      {isHidingCurrent && bigNumber ? bigNumber : isHidingCurrent && isDecreasingNumber ? isDecreasingNumber : selected.length}
                    </span>
                    {/* /10部分 - 常に表示、大きな数字表示中は色を統一 */}
                    <span className={`transition-all duration-300 ${
                      bigNumber ? getBigNumberColor(bigNumber).replace('text-red-500', 'text-red-300').replace('text-orange-500', 'text-orange-300').replace('text-yellow-500', 'text-yellow-300') : isDecreasingNumber ? 'text-blue-300' : 'text-white'
                    }`}>枚</span>
                  </span>
                </div>
              </div>
            </div>

            {/* フィルタされた困りごとカード */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h3 className="text-xl font-medium text-gray-700 mb-4">
                {selectedCategory}でこんな困りごとはありませんか？（{selected.filter(item => currentCategoryDifficulties.some((d: any) => d['困りごと内容'] === item)).length}/{currentCategoryDifficulties.length}）
              </h3>
              <div className="text-sm text-gray-500 mb-4 text-right">
                候補の困りごと: {currentCategoryDifficulties.length}件
              </div>
              <div className="grid grid-cols-2 gap-4 content-start">
                {currentCategoryDifficulties.length === 0 && (
                  <div className="text-gray-400 col-span-2">このカテゴリには該当する困りごとは見つかりませんでした。</div>
                )}
                {currentCategoryDifficulties.slice(0, getVisibleCount(selectedCategory, currentCategoryDifficulties.length)).map((item: any) => {
                  const isSelected = selected.includes(item['困りごと内容']);
                  const isDisabled = !isSelected && selected.length >= maxSelectable;
                  
                  // ドメインに応じた具体例を選択
                  let specificExample = '';
                  if (domain?.name === '企業') {
                    specificExample = item['企業具体例'];
                  } else if (domain?.name === '教育機関') {
                    specificExample = item['教育機関具体例'];
                  } else if (domain?.name === '支援機関') {
                    specificExample = item['支援機関具体例'];
                  }

                  // 具体例をカンマで分割してリスト化
                  const exampleList = specificExample.split(',').map((example, index) => (
                    <li key={index} className="text-sm text-gray-500 mb-1">
                      {example.trim()}
                    </li>
                  ));

                  // タグ情報を取得
                  const mainTags = item['主要タグ'] ? item['主要タグ'].split(',').map((tag: string) => tag.trim()) : [];
                  const subTags = item['補助タグ'] ? item['補助タグ'].split(',').map((tag: string) => tag.trim()) : [];

                  const isExpanded = expandedCards.has(item['困りごと内容']);

                  return (
                    <div
                      key={item['困りごと内容']}
                      className={`rounded-xl border-2 transition-all duration-300 w-full ${
                        isExpanded 
                          ? 'shadow-md' 
                          : 'shadow-sm hover:shadow-md'
                      } ${
                        isSelected
                          ? 'border-indigo-400 bg-gradient-to-br from-indigo-50 to-blue-100 shadow-lg transform scale-[1.02]'
                          : 'border-gray-200 bg-gradient-to-br from-gray-50 to-white hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-white'
                      } ${isDisabled ? 'opacity-40' : ''}`}
                      style={{
                        backgroundImage: isSelected ? undefined : 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0) !important',
                        backgroundSize: '20px 20px',
                        animation: deselectedCard === item['困りごと内容'] ? 'deselectBounce 0.3s ease-in-out' : undefined
                      }}
                    >
                      {/* カードのヘッダー部分（選択可能） */}
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={(e) => handleSelect(item['困りごと内容'], e)}
                            disabled={isDisabled}
                            className={`flex-1 text-left transition ${
                              isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 text-sm">{item['困りごと内容']}</span>
                              {isSelected && (
                                <div className="ml-auto">
                                  <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">✓</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </button>
                          
                          {/* 詳細表示ボタン（右端） */}
                          <button
                            onClick={() => toggleAccordion(item['困りごと内容'])}
                            className="ml-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 rounded hover:bg-blue-50"
                          >
                            <span className="transition-all duration-200">
                              {isExpanded ? '▲' : '▼'}
                            </span>
                            <span className="text-xs">{isExpanded ? '閉じる' : '詳細'}</span>
                          </button>
                        </div>
                      </div>

                      {/* アコーディオン内容 */}
                      {isExpanded && (
                        <div className="px-3 pb-3 border-t border-gray-100 pt-3 bg-gradient-to-b from-transparent to-gray-50/30">
                          <div className="space-y-3">
                            {/* 具体例 */}
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">具体例</h4>
                              <ul className="list-disc pl-4 text-sm text-gray-500 space-y-1">
                                {exampleList}
                              </ul>
                            </div>

                            {/* タグ表示 */}
                            {(mainTags.length > 0 || subTags.length > 0) && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">関連タグ</h4>
                                <div className="flex flex-wrap gap-1">
                                  {/* 主要タグ */}
                                  {mainTags.map((tag: string, index: number) => (
                                    <span key={`main-${index}`} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      #{tag} : {getTagName(tag)}
                                    </span>
                                  ))}
                                  {/* 補助タグ */}
                                  {subTags.map((tag: string, index: number) => (
                                    <span key={`sub-${index}`} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                      #{tag} : {getTagName(tag)}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* さらに表示ボタン */}
              {currentCategoryDifficulties.length > getVisibleCount(selectedCategory, currentCategoryDifficulties.length) && (
                <div className="mt-2">
                  {/* 区切り線とサブ見出し */}
                  <div className="flex items-center my-4">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <div className="px-4 text-sm text-gray-500 font-medium">— 他の困りごと —</div>
                    <div className="flex-1 h-px bg-gray-300"></div>
                  </div>
                  
                  <div className="text-center">
                    <button
                      onClick={() => showMore(selectedCategory, currentCategoryDifficulties.length)}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      残り{currentCategoryDifficulties.length - getVisibleCount(selectedCategory, currentCategoryDifficulties.length)}件を表示
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* カスタム困りごと入力 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h3 className="text-xl font-medium text-gray-700 mb-4">その他の困りごとがあれば追加してください（未実装）</h3>
              <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={input}
                  onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
                  placeholder="(未実装)"
                  disabled
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-400"
            />
            <button
              onClick={handleAddCustom}
                  disabled
                  className="px-6 py-2 bg-gray-300 text-gray-500 rounded-lg font-medium disabled:cursor-not-allowed"
            >
              送信
            </button>
          </div>
          {customDifficulties.length > 0 && (
                <div className="space-y-2">
                {customDifficulties.map((difficulty, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{difficulty}</span>
                    <button
                      onClick={() => handleRemoveCustom(difficulty)}
                        className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* グラフ表示 */
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-xl font-medium text-gray-700 mb-4">
              選択した困りごとの関連性
            </h3>
            <DifficultyGraphView 
              selectedDifficulties={selected}
              domain={domain}
              viewModel={viewModel}
            />
            </div>
          )}
        </div>

      {/* ボタン */}
        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-full bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-colors"
          >
            ⬅️ 前のステップへ
          </button>
          <button
            onClick={handleNext}
          disabled={selected.length === 0}
            className="px-6 py-3 rounded-full bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors disabled:bg-gray-300 disabled:text-gray-400"
          >
            🎮 次のステップへ
          </button>
      </div>
      
      {/* PC版カードの束（リスト表示時のみ） */}
      {viewMode === 'list' && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="relative w-[100px] h-[100px]">
            {/* カードの束の背景 */}
            <div 
              className="absolute bottom-1 right-1 w-14 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg shadow-lg transform rotate-3"
              style={isDeckAnimating ? { animation: 'deckRemove 0.4s ease-in-out' } : isDeckAdding ? { animation: 'deckAdd 0.5s ease-in-out' } : {}}
            ></div>
            <div 
              className="absolute bottom-2 right-2 w-14 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg shadow-md transform rotate-1"
              style={isDeckAnimating ? { animation: 'deckRemove 0.4s ease-in-out 0.05s' } : isDeckAdding ? { animation: 'deckAdd 0.5s ease-in-out 0.05s' } : {}}
            ></div>
            <div 
              className="absolute bottom-3 right-3 w-14 h-16 bg-gradient-to-br from-indigo-300 to-indigo-500 rounded-lg shadow-sm transform -rotate-1"
              style={isDeckAnimating ? { animation: 'deckRemove 0.4s ease-in-out 0.1s' } : isDeckAdding ? { animation: 'deckAdd 0.5s ease-in-out 0.1s' } : {}}
            ></div>
            <div 
              className="absolute bottom-4 right-4 w-14 h-16 bg-gradient-to-br from-indigo-200 to-indigo-400 rounded-lg transform -rotate-2"
              style={isDeckAnimating ? { animation: 'deckRemove 0.4s ease-in-out 0.15s' } : isDeckAdding ? { animation: 'deckAdd 0.5s ease-in-out 0.15s' } : {}}
            ></div>
            
            {/* 追加されるカードのアニメーション */}
            {addingCard && (
              <div
                className="absolute bottom-1 right-1 w-14 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-300 rounded-lg shadow-lg z-10"
                style={{ animation: 'cardSlideIn 0.8s ease-in-out forwards' }}
              >
                <div className="p-1 h-full flex flex-col justify-center items-center">
                  <div className="text-sm mb-1">{getCategoryIcon(addingCard.category)}</div>
                  <div className="text-xs text-gray-800 text-center leading-tight">
                    {addingCard.title.length > 6 ? addingCard.title.substring(0, 6) + '...' : addingCard.title}
                  </div>
                </div>
              </div>
            )}
            
            {/* 削除されるカードのアニメーション */}
            {removingCard && (
              <div
                className="absolute bottom-1 right-1 w-14 h-16 bg-gradient-to-br from-red-50 to-pink-100 border-2 border-red-300 rounded-lg shadow-lg z-10"
                style={{ animation: 'cardSlideOut 0.6s ease-in-out forwards' }}
              >
                <div className="p-1 h-full flex flex-col justify-center items-center">
                  <div className="text-sm mb-1">{getCategoryIcon(removingCard.category)}</div>
                  <div className="text-xs text-gray-800 text-center leading-tight">
                    {removingCard.title.length > 6 ? removingCard.title.substring(0, 6) + '...' : removingCard.title}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DifficultyThinking; 