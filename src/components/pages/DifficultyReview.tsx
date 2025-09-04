import React, { useState } from 'react';
import SideNav from '../layout/SideNav';
import Header from '../layout/Header';
import { Difficulty } from '../../types';
import reasonableAccommodations from '../../data/user/ReasonableAccommodation.json';

// props型定義
interface DifficultyReviewProps {
  difficulties: Difficulty[];
  prioritizedIds: string[];
  onTogglePriority: (difficultyId: string) => void;
  onNext: () => void;
}

// 配慮案型（日本語プロパティは文字列リテラルで定義）
type AccommodationItem = {
  [key: string]: string;
  '配慮内容': string;
  '具体的な配慮': string;
  'コスト': string;
  '難易度': string;
  '効果・影響': string;
};

const DifficultyReview: React.FC<DifficultyReviewProps> = ({ difficulties, prioritizedIds, onTogglePriority, onNext }) => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // 困りごと名から配慮案リストを抽出
  const getAccommodations = (difficultyName: string): AccommodationItem[] => {
    return (reasonableAccommodations as any[])
      .filter(item => item['困りごと内容'] === difficultyName)
      .map(item => ({
        '配慮内容': item['配慮内容'],
        '具体的な配慮': item['具体的な配慮'],
        'コスト': item['コスト'],
        '難易度': item['難易度'],
        '効果・影響': item['効果・影響'],
      }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <SideNav currentStep="selection" />
        <main className="flex-1 px-12 py-10">
          <h2 className="text-2xl font-bold mb-2">整理した困りごとに優先順位をつけましょう</h2>
          <p className="mb-6 text-gray-600">あなたが職場や支援者に伝えたい困りごとを3つ選びましょう</p>
          <div className="space-y-3">
            {difficulties.map((d) => {
              const isOpen = openAccordion === d.id;
              const accommodations = getAccommodations(d.name);
              return (
                <div key={d.id} className={`bg-white rounded-lg shadow flex flex-col border ${prioritizedIds.includes(d.id) ? 'border-yellow-400' : 'border-transparent'}`}>
                  <div className="flex items-center px-4 py-3">
                    <button
                      className="mr-3 text-yellow-400 text-xl focus:outline-none"
                      onClick={() => onTogglePriority(d.id)}
                      aria-label="優先順位をつける"
                    >
                      {prioritizedIds.includes(d.id) ? '★' : '☆'}
                    </button>
                    <span className="text-2xl mr-2">{d.tags[0] || '📝'}</span>
                    <span className="flex-1 text-lg">{d.name}</span>
                    <button
                      className="ml-4 px-3 py-1 text-sm bg-gray-100 rounded border border-gray-300 hover:bg-gray-200"
                      onClick={() => setOpenAccordion(isOpen ? null : d.id)}
                    >
                      {isOpen ? '配慮を閉じる' : '配慮を見る'}
                    </button>
                  </div>
                  {isOpen && (
                    <div className="bg-indigo-50 px-6 py-4 border-t border-indigo-100 space-y-3">
                      {accommodations.length === 0 ? (
                        <div className="text-gray-500">該当する配慮案がありません</div>
                      ) : (
                        accommodations.map((a, idx) => (
                          <div key={idx} className="mb-2 p-3 rounded bg-white border border-indigo-200">
                            <div className="font-semibold text-indigo-700 mb-1">配慮案：{a['配慮内容']}</div>
                            <div className="text-gray-700 mb-1">{a['具体的な配慮']}</div>
                            <div className="flex flex-wrap gap-2 text-xs mt-1">
                              <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200">コスト：{a['コスト']}</span>
                              <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200">難易度：{a['難易度']}</span>
                            </div>
                          </div>
                        ))
                      )}
                      <div className="text-xs text-gray-500 mt-2">この配慮案は参考例として支援者に提示されます</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-end mt-8">
            <button
              onClick={onNext}
              disabled={prioritizedIds.length === 0}
              className="px-8 py-3 rounded-full bg-indigo-500 text-white font-semibold text-lg shadow hover:bg-indigo-600 transition disabled:bg-gray-300 disabled:text-gray-400"
            >
              次のステップへ
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DifficultyReview; 