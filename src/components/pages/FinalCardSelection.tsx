import React, { useState, useEffect } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import StepFooter from '../layout/StepFooter';

type FinalCardSelectionProps = {
  selectedDifficulties: any[];
  onComplete: (selectedDifficulties: any[]) => void;
  onBack: () => void;
};

const FinalCardSelection: React.FC<FinalCardSelectionProps> = ({
  selectedDifficulties,
  onComplete,
  onBack
}) => {
  const isMobile = useIsMobile();
  const [finalSelection, setFinalSelection] = useState<any[]>([]);

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

  const addToFinalSelection = (card: any) => {
    if (finalSelection.length < 3 && !finalSelection.find(c => c.id === card.id)) {
      setFinalSelection(prev => [...prev, card]);
    }
  };

  const removeFromFinalSelection = (card: any) => {
    setFinalSelection(prev => prev.filter(c => c.id !== card.id));
  };

  const handleNext = () => {
    onComplete(finalSelection);
  };

  const availableCards = selectedDifficulties.filter(card => 
    !finalSelection.find(selected => selected.id === card.id)
  );

  return (
    <div className="min-h-screen bg-sand p-4">
      <div className="max-w-6xl mx-auto">
        {/* 説明文 */}
        <div className="bg-light-sand border border-teal-500 rounded-lg p-6 mb-8">
          <p className="text-gray-700 text-base leading-relaxed">
            <span className="font-semibold">🎯 決定のステージ</span><br />
            残ったカードの中から3枚を選び、あなたが最も大事だと感じる困りごとにフォーカスします。
          </p>
        </div>

        {/* デッキ（10枚のカード） */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            🃏 あなたの困りごとデッキ ({selectedDifficulties.length}枚)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {selectedDifficulties.map((card, index) => {
              const isSelected = finalSelection.find(c => c.id === card.id);
              const isDisabled = finalSelection.length >= 3 && !isSelected;
              const selectionIndex = finalSelection.findIndex(c => c.id === card.id);
              
              return (
                <div
                  key={card.id}
                  onClick={() => isSelected ? removeFromFinalSelection(card) : addToFinalSelection(card)}
                  className={`relative cursor-pointer transition-all duration-300 group ${
                    isSelected 
                      ? 'transform scale-110 z-20' 
                      : isDisabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:scale-105 hover:z-10'
                  }`}
                  style={{
                    transform: isSelected ? 'scale(1.1) translateY(-10px)' : 'scale(1)',
                    zIndex: isSelected ? 20 : 1,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {/* カード本体 */}
                  <div className={`bg-gradient-to-br rounded-xl p-4 border-2 relative overflow-hidden ${
                    isSelected 
                      ? 'from-yellow-100 to-orange-200 border-yellow-400 shadow-2xl' 
                      : isDisabled
                      ? 'from-gray-50 to-gray-100 border-gray-200'
                      : 'from-teal-50 to-teal-100 border-teal-300 hover:shadow-xl'
                  }`}>
                    
                    {/* 光る効果 */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/50 via-orange-200/50 to-yellow-200/50 animate-pulse rounded-xl"></div>
                    )}
                    
                    {/* レア度の星 */}
                    <div className="absolute top-2 right-2">
                      {isSelected ? (
                        <div className="text-yellow-500 text-lg animate-bounce">
                          ⭐
                        </div>
                      ) : (
                        <div className="text-gray-300 text-sm">
                          ☆
                        </div>
                      )}
                    </div>
                    
                    {/* 選択順序 */}
                    {isSelected && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center font-bold shadow-lg">
                        {selectionIndex + 1}
                      </div>
                    )}
                    
                    <div className="text-center relative z-10">
                      <div className="text-2xl mb-2">
                        {getCategoryIcon(card.category || card['カテゴリ'] || 'その他')}
                      </div>
                      <h4 className="font-medium text-gray-800 text-sm leading-tight">
                        {card.title || card['困りごと内容']}
                      </h4>
                    </div>
                    
                    {/* ホバー時の光沢効果 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>
                  
                  {/* 選択時の光る枠 */}
                  {isSelected && (
                    <div className="absolute inset-0 border-4 border-yellow-400 rounded-xl animate-pulse pointer-events-none"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 最終選択（3枚） */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl shadow-lg p-6 mb-8 border-2 border-yellow-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
            ⭐ 重要な困りごとカード選択 ({finalSelection.length}/3枚)
          </h2>
          <div className="text-center mb-4">
            {finalSelection.length === 3 ? (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
                <p className="text-sm font-bold">⭐ 重要な困りごとカード選択完了！ ⭐</p>
              </div>
            ) : (
              <div className="bg-teal-100 text-teal-700 px-4 py-2 rounded-full">
                <p className="text-sm font-medium">
                  {3 - finalSelection.length}枚選択してください
                </p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-32">
            {finalSelection.map((card, index) => (
              <div
                key={card.id}
                className="bg-gradient-to-br from-yellow-100 to-orange-200 border-2 border-yellow-400 rounded-xl p-4 relative group shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                {/* レア度表示 */}
                <div className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full w-8 h-8 text-xs flex items-center justify-center font-bold shadow-lg">
                  {index + 1}
                </div>
                
                {/* 星の装飾 */}
                <div className="absolute top-2 right-2 text-yellow-500 text-lg animate-pulse">
                  ⭐
                </div>
                
                <div className="text-center pt-2">
                  <div className="text-3xl mb-2">
                    {getCategoryIcon(card.category || card['カテゴリ'] || 'その他')}
                  </div>
                  <h4 className="font-medium text-gray-800 text-sm leading-tight">
                    {card.title || card['困りごと内容']}
                  </h4>
                </div>
                
                <button
                  onClick={() => removeFromFinalSelection(card)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 shadow-lg z-10 font-bold"
                  style={{ backgroundColor: '#EF4444' }}
                >
                  ×
                </button>
                
                {/* 光る効果 */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/30 via-orange-200/30 to-yellow-200/30 animate-pulse rounded-xl pointer-events-none z-0"></div>
              </div>
            ))}
            {Array.from({ length: 3 - finalSelection.length }).map((_, i) => (
              <div key={`empty-${i}`} className="border-2 border-dashed border-yellow-300 rounded-xl p-4 flex flex-col items-center justify-center bg-yellow-50/50">
                <div className="text-yellow-400 text-3xl mb-2">☆</div>
                <div className="text-yellow-600 text-sm font-medium">空きスロット</div>
              </div>
            ))}
          </div>
        </div>

        {/* フッター */}
        <StepFooter
          showBackButton={true}
          onBack={onBack}
          onNext={handleNext}
          nextButtonText="🎮 次のステップへ"
          nextButtonDisabled={finalSelection.length !== 3}
          isMobile={true}
        />
      </div>
    </div>
  );
};

export default FinalCardSelection;
