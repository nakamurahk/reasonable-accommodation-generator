import React, { useState, useEffect } from 'react';
import { ViewModel } from '../../types/newDataStructure';

type DeckBuildingProps = {
  selectedDifficulties: any[];
  onComplete: (data: { selectedCards: any[]; originalCards: any[] }) => void;
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
  const [flyingCard, setFlyingCard] = useState<{card: any, targetIndex: number, startX: number, startY: number, endX: number, endY: number} | null>(null);

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

  useEffect(() => {
    // 選択された困りごとをカードプールとして設定
    setCardPool(selectedDifficulties);
    setDeck([]);
  }, [selectedDifficulties]);

  const addToDeck = (card: any, event: React.MouseEvent) => {
    if (deck.length < 10) {
      // クリック位置を取得
      const rect = event.currentTarget.getBoundingClientRect();
      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height / 2;
      
      // デッキスロットの位置を計算（次の空きスロット）
      const deckSlotIndex = deck.length;
      const deckSlotX = startX; // 簡略化：実際はデッキスロットの位置を計算
      const deckSlotY = window.innerHeight - 200; // デッキエリアの大体の位置
      
      // アニメーション開始
      setFlyingCard({ 
        card, 
        targetIndex: deckSlotIndex,
        startX,
        startY,
        endX: deckSlotX,
        endY: deckSlotY
      });
      
      // アニメーション完了後に実際の状態を更新
      setTimeout(() => {
        setDeck([...deck, card]);
        setCardPool(cardPool.filter(c => c.id !== card.id));
        setFlyingCard(null);
      }, 1000); // アニメーション時間に合わせて調整
    }
  };

  const removeFromDeck = (card: any) => {
    setDeck(deck.filter(c => c.id !== card.id));
    setCardPool([...cardPool, card]);
  };

  const handleNext = () => {
    // 選択されたカードと元のカードプール全体を渡す
    onComplete({
      selectedCards: deck,
      originalCards: selectedDifficulties // 元の全カードプール
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      {/* CSS アニメーション */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes cardToDeck {
            0% {
              transform: translate(0, 0) rotate(0deg) scale(1);
              opacity: 1;
            }
            20% {
              transform: translate(0, -20px) rotate(0deg) scale(1.05);
              opacity: 1;
            }
            50% {
              transform: translate(0, -100px) rotate(90deg) scale(0.9);
              opacity: 0.9;
            }
            80% {
              transform: translate(0, -150px) rotate(180deg) scale(0.8);
              opacity: 0.8;
            }
            100% {
              transform: translate(0, -200px) rotate(180deg) scale(0.7);
              opacity: 0;
            }
          }
          
          .card-flying {
            animation: cardToDeck 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            position: fixed;
            z-index: 1000;
            pointer-events: none;
          }
        `
      }} />
      <div className="max-w-6xl mx-auto">
        {/* 飛んでいるカード */}
        {flyingCard && (
          <div
            className="card-flying"
            style={{
              left: `${flyingCard.startX}px`,
              top: `${flyingCard.startY}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-300 rounded-xl p-3 w-24 h-16 flex flex-col items-center justify-center shadow-lg">
              <div className="text-lg mb-1">
                {getCategoryIcon(flyingCard.card.category || flyingCard.card['カテゴリ'] || 'その他')}
              </div>
              <div className="text-xs font-medium text-gray-800 text-center leading-tight">
                {flyingCard.card.title || flyingCard.card['困りごと内容']}
              </div>
            </div>
          </div>
        )}
        
        {/* 説明文 */}
               <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                 <p className="text-gray-700 text-lg leading-relaxed">
                   💡 選抜のステージ<br />
                   集めたカードの中から最大10枚を選び、あなたにとって特に重要だと感じる困りごとを絞り込みましょう。
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
            🃏 カードプール ({cardPool.length}枚)
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
                    onClick={(e) => addToDeck(card, e)}
                    className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-300 rounded-xl p-3 cursor-pointer hover:shadow-xl hover:scale-110 transition-all duration-300 hover:border-blue-500 hover:rotate-1 relative group"
                    style={{
                      transform: `rotate(${(index % 3 - 1) * 1}deg)`,
                      zIndex: cardPool.length - index
                    }}
                  >
                    {/* カードの光沢効果 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl pointer-events-none"></div>
                    
                          <div className="text-center relative z-10">
                             <div className="text-xl mb-2 group-hover:scale-110 transition-transform">
                               {getCategoryIcon(card.category || card['カテゴリ'] || 'その他')}
                             </div>
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
          <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
            🃏 あなたのデッキ ({deck.length}/10枚)
          </h2>
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              {deck.length === 10 ? '✅ デッキ完成！' : deck.length > 0 ? `${deck.length}枚選択中` : 'カードを選択してください'}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-3 min-h-32">
            {deck.map((card, index) => (
              <div
                key={card.id}
                className="bg-gradient-to-br from-yellow-50 to-orange-100 border-2 border-yellow-300 rounded-lg p-3 cursor-pointer hover:shadow-md transition-all duration-200 relative group"
              >
                      <div className="text-center">
                         <div className="text-lg mb-1">
                           {getCategoryIcon(card.category || card['カテゴリ'] || 'その他')}
                         </div>
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

          <button
            onClick={handleNext}
            disabled={deck.length === 0}
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
