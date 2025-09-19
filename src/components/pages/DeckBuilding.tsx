import React, { useState, useEffect } from 'react';
import { ViewModel } from '../../types/newDataStructure';

type DeckBuildingProps = {
  selectedDifficulties: any[];
  onComplete: (selectedDifficulties: any[]) => void;
  onBack: () => void;
  viewModel: ViewModel | null | undefined;
};

const DeckBuilding: React.FC<DeckBuildingProps> = ({
  selectedDifficulties,
  onComplete,
  onBack,
  viewModel
}) => {
  const [deck, setDeck] = useState<any[]>([]);
  const [cardPool, setCardPool] = useState<any[]>([]);

  useEffect(() => {
    // 選択された困りごとをカードプールとして設定
    setCardPool(selectedDifficulties);
    setDeck([]);
  }, [selectedDifficulties]);

  const addToDeck = (card: any) => {
    if (deck.length < 10) {
      setDeck([...deck, card]);
      setCardPool(cardPool.filter(c => c.id !== card.id));
    }
  };

  const removeFromDeck = (card: any) => {
    setDeck(deck.filter(c => c.id !== card.id));
    setCardPool([...cardPool, card]);
  };

  const handleNext = () => {
    onComplete(deck);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🎴 デッキ構築
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            カードプールから10枚を選んで、あなたのデッキを構築しよう！<br />
            最も重要で対処したい困りごとを厳選して選んでね。
          </p>
        </div>

        {/* カードプール（画面中央） */}
        <div className="bg-gradient-to-br from-slate-100 to-gray-200 rounded-2xl shadow-lg p-8 mb-8 relative overflow-hidden">
          {/* 背景装飾 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 text-6xl">🃏</div>
            <div className="absolute top-8 right-8 text-4xl">🃏</div>
            <div className="absolute bottom-6 left-8 text-5xl">🃏</div>
            <div className="absolute bottom-4 right-4 text-3xl">🃏</div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center relative z-10">
            📦 カードプール ({cardPool.length}枚)
          </h2>
          
          <div className="relative z-10">
            {cardPool.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-gray-600 text-lg">すべてのカードがデッキに追加されました！</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-96 overflow-y-auto overflow-x-hidden">
                {cardPool.map((card, index) => (
                  <div
                    key={card.id}
                    onClick={() => addToDeck(card)}
                    className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-300 rounded-xl p-3 cursor-pointer hover:shadow-xl hover:scale-110 transition-all duration-300 hover:border-blue-500 hover:rotate-1 relative group"
                    style={{
                      transform: `rotate(${(index % 3 - 1) * 1}deg)`,
                      zIndex: cardPool.length - index
                    }}
                  >
                    {/* カードの光沢効果 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl pointer-events-none"></div>
                    
                    <div className="text-center relative z-10">
                      <div className="text-xl mb-2 group-hover:scale-110 transition-transform">🎯</div>
                      <h3 className="font-medium text-gray-800 text-xs leading-tight group-hover:text-blue-700 transition-colors">
                        {card.title || card['困りごと内容']}
                      </h3>
                    </div>
                    
                    {/* ホバー時の追加効果 */}
                    <div className="absolute inset-0 bg-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* デッキ（画面下部） */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            🃏 あなたのデッキ ({deck.length}/10枚)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-3 min-h-32">
            {deck.map((card, index) => (
              <div
                key={card.id}
                className="bg-gradient-to-br from-yellow-50 to-orange-100 border-2 border-yellow-300 rounded-lg p-3 cursor-pointer hover:shadow-md transition-all duration-200 relative group"
              >
                <div className="text-center">
                  <div className="text-lg mb-1">⭐</div>
                  <h4 className="font-medium text-gray-800 text-xs leading-tight">
                    {card.title || card['困りごと内容']}
                  </h4>
                  <button
                    onClick={() => removeFromDeck(card)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            {/* 空のスロット */}
            {Array.from({ length: 10 - deck.length }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="border-2 border-dashed border-gray-300 rounded-lg p-3 flex items-center justify-center"
              >
                <div className="text-gray-400 text-2xl">+</div>
              </div>
            ))}
          </div>
        </div>

        {/* ナビゲーションボタン */}
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-full bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-colors"
          >
            ⬅️ 前のステップへ
          </button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              {deck.length === 10 ? '✅ デッキ完成！' : `${10 - deck.length}枚追加してください`}
            </p>
          </div>

          <button
            onClick={handleNext}
            disabled={deck.length !== 10}
            className="px-6 py-3 rounded-full bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors disabled:bg-gray-300 disabled:text-gray-400"
          >
            🎮 次のステップへ
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeckBuilding;
