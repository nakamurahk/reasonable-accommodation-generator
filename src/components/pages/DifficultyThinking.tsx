import React, { useState, useEffect, useMemo } from 'react';
import { Situation, CharacteristicType, Domain } from '../../types';
import reasonableAccommodations from '../../data/user/ReasonableAccommodation.json';
import AccommodationDisplay from './AccommodationDisplay';
import { useIsMobile } from '../../hooks/useIsMobile';

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
};

const DifficultyThinking: React.FC<DifficultyThinkingProps> = ({
  characteristics,
  domain,
  situations,
  onComplete,
  selectedDifficulties,
  onBack
}) => {
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
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
  
  // 数値に応じた色を決定する関数
  const getBigNumberColor = (num: number) => {
    if (num >= 11) return 'text-red-500'; // 11以降はビビットな赤（超えてますよ！）
    if (num === 10) return 'text-orange-500'; // 10はオレンジ
    return 'text-yellow-500'; // 1-9はイエロー系
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

  // フィルタ関数
  const filteredDifficulties = (reasonableAccommodations as any[]).filter(item => {
    // 特性タイプ: OR条件
    const itemTraits = (item['特性タイプ'] || '').split(',');
    const hasTrait = selectedCharacteristicNames.some(name => itemTraits.includes(name));

    // ドメイン: OR条件
    const itemDomains = (item['ドメイン'] || '').split(',');
    const hasDomain = selectedDomainName ? itemDomains.includes(selectedDomainName) : false;

    // 場面: OR条件
    const hasSituation = (() => {
      if (!domain) return false;

      // ドメインに応じたシチュエーションフィールドを選択
      const situationField = {
        '企業': '企業でのシチュエーション',
        '教育機関': '教育機関でのシチュエーション',
        '支援機関': '支援機関でのシチュエーション'
      }[domain.name];

      if (!situationField) return false;

      // 選択されたシチュエーションとJSONのシチュエーションを比較
      const itemSituations = (item[situationField] || '').split(',');
      return selectedSituationNames.some(selectedSituation => 
        itemSituations.some((itemSituation: string) => 
          itemSituation.trim() === selectedSituation.trim()
        )
      );
    })();

    // AND条件
    return hasTrait && hasDomain && hasSituation;
  });

  // 困りごと内容で重複排除
  const uniqueDifficulties = useMemo(() => {
  const uniqueDifficultiesMap = new Map<string, any>();
  filteredDifficulties.forEach(item => {
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
  const maxSelectable = 20;
  const handleSelect = (content: string) => {
    setSelected(prev => {
      if (prev.includes(content)) {
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
      icon: '📝',
      cares: [],
      accommodations: []
    }));

    onComplete([...selectedDifficulties, ...customDifficultiesWithIds]);
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
                {category} ({selected.filter(item => difficultiesByCategory[category]?.some((d: any) => d['困りごと内容'] === item)).length}/{count})
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
              {category} ({selected.filter(item => difficultiesByCategory[category]?.some((d: any) => d['困りごと内容'] === item)).length}/{count})
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
        {/* 選択件数固定表示 - 直角三角形 */}
        <div className="fixed bottom-0 right-0 z-50">
          <div className="relative w-[100px] h-[100px]">
            {/* 直角三角形の背景 */}
            <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[100px] border-l-transparent border-b-[100px] border-b-indigo-600"></div>
          </div>
        </div>
        
        {/* 3/10テキスト表示 - 高いレイヤーで背景に重なる */}
        <div className="fixed bottom-4 right-3 z-[60]">
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
            }`}>/10</span>
          </div>
        </div>
        

        {/* 選択済み困りごとモーダル */}
        {showSelectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
              {/* モーダルヘッダー */}
              <div className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  選択済み困りごと
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
          <strong>困りごとを考えてみましょう。</strong><br />
最大20個まで選択できます。<strong><span className="text-red-500 font-bold">10</span>個まで絞り込む</strong>と次のステップに進めます。<br />
右下の選択数表示をタップで整理できます。
        </p>
        </div>
        
        <div className="space-y-4">
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
            <div className="grid grid-cols-1 gap-4 min-h-[420px] content-start">
              {currentCategoryDifficulties.length === 0 && (
                <div className="text-gray-400">このカテゴリには該当する困りごとは見つかりませんでした。</div>
              )}
              {currentCategoryDifficulties.map((item: any) => {
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

                return (
                  <button
                    key={item['困りごと内容']}
                    onClick={() => handleSelect(item['困りごと内容'])}
                    disabled={isDisabled}
                    className={`p-4 rounded-lg border text-left transition w-full flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    } ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-medium text-gray-900">{item['困りごと内容']}</span>
                    </div>
                    <div className="flex-1 flex items-start">
                      <ul className="list-disc pl-4 text-sm text-gray-500">
                        {exampleList}
                      </ul>
                    </div>
                  </button>
                );
              })}
            </div>
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
        </div>

        {/* ボタン */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={handleNext}
            disabled={selected.length === 0 || selected.length > 10}
            className="w-full px-8 py-4 rounded-full bg-indigo-500 text-white font-semibold text-lg shadow hover:bg-indigo-600 transition disabled:bg-gray-300 disabled:text-gray-400"
          >
            次へ進む
          </button>
          <button
            onClick={onBack}
            className="w-full px-8 py-4 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold text-lg shadow hover:bg-gray-100 transition"
          >
            前のページに戻る
          </button>
        </div>
      </div>
    );
  }

  // PC版UI
  return (
    <div className="max-w-none mx-auto p-6 space-y-8">
      {/* 選択済み困りごとモーダル */}
      {showSelectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* モーダルヘッダー */}
            <div className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">選択済み困りごと</h3>
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
              )}
            </div>
            
            {/* モーダルフッター */}
            <div className="px-6 py-4 border-t bg-gray-50">
              <button
                onClick={() => setShowSelectionModal(false)}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
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
          <strong>困りごとを考えてみましょう。</strong><br />
最大20個まで選択できます。<strong><span className="text-red-500 font-bold">10</span>個まで絞り込む</strong>と次のステップに進めます。<br />
右下の選択数表示をタップで整理できます。
        </p>
      </div>
      
      <div className="space-y-6">
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
                   }`}>/10</span>
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
            {currentCategoryDifficulties.map((item: any) => {
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

              return (
                <button
                  key={item['困りごと内容']}
                  onClick={() => handleSelect(item['困りごと内容'])}
                  disabled={isDisabled}
                  className={`p-3 rounded-lg border text-left transition w-full h-[160px] flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  } ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-medium text-gray-900 text-sm">{item['困りごと内容']}</span>
                  </div>
                  <div className="flex-1 flex items-start">
                    <ul className="list-disc pl-4 text-sm text-gray-500">
                      {exampleList}
                    </ul>
                  </div>
                </button>
              );
            })}
          </div>
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
        </div>

      {/* ボタン */}
        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-8 py-3 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold text-lg shadow hover:bg-gray-100 transition"
          >
            前のページに戻る
          </button>
          <button
            onClick={handleNext}
          disabled={selected.length === 0 || selected.length > 10}
            className="px-8 py-3 rounded-full bg-indigo-500 text-white font-semibold text-lg shadow hover:bg-indigo-600 transition disabled:bg-gray-300 disabled:text-gray-400"
          >
            次へ進む
          </button>
      </div>
    </div>
  );
};

export default DifficultyThinking; 