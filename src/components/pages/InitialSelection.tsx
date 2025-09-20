import React, { useState } from 'react';
import { CharacteristicType, Domain, Situation } from '../../types';
// @ts-ignore
import { CHARACTERISTICS, DOMAINS } from '../../data/constants';
import { useIsMobile } from '../../hooks/useIsMobile';

// 特性グループ定義
const CHARACTERISTIC_GROUPS = [
  {
    label: '発達障害系',
    ids: ['ADHD', 'ASD', 'LD'],
  },
  {
    label: '精神障害系',
    ids: ['depression', 'bipolar', 'anxiety', 'ptsd'],
  },
  {
    label: '身体・慢性疾患系',
    ids: ['physical'],
  },
  {
    label: '感覚・感受性特性系',
    ids: ['hsp'],
  },
];

type InitialSelectionProps = {
  onComplete: (selectedCharacteristics: CharacteristicType[], selectedDomain: Domain, selectedSituations: Situation[]) => void;
};

const InitialSelection: React.FC<InitialSelectionProps> = ({ onComplete }) => {
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<CharacteristicType[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [selectedSituations, setSelectedSituations] = useState<Situation[]>([]);
  const isMobile = useIsMobile();

  // 特性: 複数選択可
  const handleCharacteristicToggle = (characteristic: CharacteristicType) => {
    setSelectedCharacteristics(prev =>
      prev.find(c => c.id === characteristic.id)
        ? prev.filter(c => c.id !== characteristic.id)
        : [...prev, characteristic]
    );
  };

  // ドメイン: 1つのみ選択可
  const handleDomainSelect = (domain: Domain) => {
    setSelectedDomain(domain);
    setSelectedSituations([]);
  };

  // 場面: 複数選択可能
  const handleSituationSelect = (situation: Situation) => {
    setSelectedSituations(prev => {
      if (prev.some(s => s.id === situation.id)) {
        return prev.filter(s => s.id !== situation.id);
      } else {
        return [...prev, situation];
      }
    });
  };

  const handleNext = () => {
    if (selectedCharacteristics.length > 0 && selectedDomain && selectedSituations.length > 0) {
      onComplete(selectedCharacteristics, selectedDomain, selectedSituations);
    }
  };

  // モバイル用UI
  if (isMobile) {
    return (
      <div className="max-w-none mx-auto p-4 space-y-6">
                {/* 説明文 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-gray-700 text-base leading-relaxed">
            <strong>特性と環境を選択しましょう。</strong><br />
まず<strong>特性</strong>を選択し、次に<strong>環境</strong>を選択してください。<strong>環境</strong>に応じて<strong>シチュエーション</strong>が表示されます。
          </p>
        </div>
        
        {/* 特性選択 */}
        <div className="space-y-4 bg-gray-100 pt-4 pb-4 pl-4 pr-2 rounded-md border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-700">
            🧠あなたの特性を選んでください（複数選択可 / {selectedCharacteristics.length}件選択中）
          </h2>
          <div className="border-b border-gray-200 my-2"></div>
          <div className="space-y-3">
            {CHARACTERISTIC_GROUPS.map(group => (
              <div key={group.label} className="bg-white border rounded-md px-3 py-3 space-y-2 shadow-sm mt-3 mb-2">
                <span className="text-sm font-semibold text-gray-700 tracking-wide mb-1 mt-2">{group.label}</span>
                <div className="grid grid-cols-1 gap-2 mb-2 w-full">
                  {CHARACTERISTICS.filter((char: any) => group.ids.includes(char.id)).map((char: any) => (
                    <div key={char.id} className="relative">
                      <button
                        type="button"
                        onClick={() => handleCharacteristicToggle(char)}
                        className={`w-full px-4 py-3 rounded border font-medium transition text-center shadow-sm
                          ${selectedCharacteristics.some(c => c.id === char.id)
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50'}`}
                      >
                        {char.name}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ドメイン選択 */}
        <div className="space-y-4 bg-gray-100 pt-4 pb-4 pl-4 pr-2 rounded-md border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-700">🏢環境を選んでください（1つのみ）</h2>
          <div className="border-b border-gray-200 my-2"></div>
          <div className="grid grid-cols-1 gap-3">
            {DOMAINS.map((domain: any) => (
              <button
                key={domain.id}
                type="button"
                onClick={() => handleDomainSelect(domain)}
                className={`w-full px-4 py-3 rounded border font-medium transition text-center shadow-sm
                  ${selectedDomain?.id === domain.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50'}`}
              >
                {domain.name}
              </button>
            ))}
          </div>
        </div>

        {/* シチュエーション選択 */}
        <div className="space-y-4 bg-gray-100 pt-4 pb-4 pl-4 pr-2 rounded-md border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-700">
            📝シチュエーションを選んでください（複数選択可 / {selectedSituations.length}件選択中）
          </h2>
          <div className="border-b border-gray-200 my-2"></div>
          <div className="grid grid-cols-1 gap-3">
            {selectedDomain && (
              <>
                <div className="w-full flex justify-end mb-2">
                  <button
                    onClick={() => {
                      const allSituations = selectedDomain.situations;
                      const isAllSelected = allSituations.every(s => 
                        selectedSituations.some(selected => selected.id === s.id)
                      );
                      const newSelectedSituations = isAllSelected
                        ? selectedSituations.filter(s => 
                            !allSituations.some(situation => situation.id === s.id)
                          )
                        : [...selectedSituations, ...allSituations];
                      setSelectedSituations(newSelectedSituations);
                    }}
                    className={`px-3 py-1 text-sm rounded-full ${
                      selectedDomain.situations.every(s => 
                        selectedSituations.some(selected => selected.id === s.id)
                      )
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {selectedDomain.situations.every(s => 
                      selectedSituations.some(selected => selected.id === s.id)
                    )
                      ? '全て解除'
                      : '全て選択'}
                  </button>
                </div>
                {selectedDomain.situations.map((situation) => (
                  <button
                    key={situation.id}
                    type="button"
                    onClick={() => handleSituationSelect(situation)}
                    className={`w-full px-4 py-3 rounded border font-medium transition text-center shadow-sm
                      ${selectedSituations.some(s => s.id === situation.id)
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50'}`}
                  >
                    {situation.name}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        {/* 次へ進むボタン */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleNext}
            disabled={selectedCharacteristics.length === 0 || !selectedDomain || selectedSituations.length === 0}
            className="px-6 py-3 rounded-full bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors disabled:bg-gray-300 disabled:text-gray-400"
          >
            🎮 次のステージへ
          </button>
        </div>
      </div>
    );
  }

  // PC版UI（既存のまま）
  return (
    <div className="max-w-none mx-auto p-6 space-y-8">
            {/* 説明文 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                  <p className="text-gray-700 text-lg leading-relaxed">
            <strong>特性と環境を選択しましょう。</strong><br />
まず<strong>特性</strong>を選択し、次に<strong>環境</strong>を選択してください。<strong>環境</strong>に応じて<strong>シチュエーション</strong>が表示されます。
          </p>
      </div>
      
      {/* 特性選択 */}
      <div className="space-y-4 bg-gray-100 pt-6 pb-6 pl-6 pr-2 rounded-md border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-700">
          🧠あなたの特性を選んでください（複数選択可 / {selectedCharacteristics.length}件選択中）
        </h2>
        <div className="border-b border-gray-200 my-2"></div>
        <div className="space-y-3">
          {CHARACTERISTIC_GROUPS.map(group => (
            <div key={group.label} className="bg-white border rounded-md px-4 py-3 space-y-2 shadow-sm mt-4 mb-2">
              <span className="text-sm font-semibold text-gray-700 tracking-wide mb-1 mt-4">{group.label}</span>
              <div className="flex flex-wrap gap-3 mb-2 w-full">
                {CHARACTERISTICS.filter((char: any) => group.ids.includes(char.id)).map((char: any) => (
                  <div key={char.id} className="relative inline-block">
                    <button
                      type="button"
                      style={{ width: '180px' }}
                      onClick={() => handleCharacteristicToggle(char)}
                      className={`px-4 py-2 h-10 rounded border font-medium transition text-center shadow-sm
                        ${selectedCharacteristics.some(c => c.id === char.id)
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50'}`}
                    >
                      {char.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ドメイン選択 */}
      <div className="space-y-4 bg-gray-100 pt-6 pb-6 pl-6 pr-2 rounded-md border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-700">🏢環境を選んでください（1つのみ）</h2>
        <div className="border-b border-gray-200 my-2"></div>
        <div className="flex flex-wrap gap-6">
          {DOMAINS.map((domain: any) => (
            <button
              key={domain.id}
              type="button"
              style={{ width: '240px' }}
              onClick={() => handleDomainSelect(domain)}
              className={`px-4 py-2 rounded border font-medium transition text-center shadow-sm
                ${selectedDomain?.id === domain.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50'}`}
            >
              {domain.name}
            </button>
          ))}
        </div>
      </div>

      {/* シチュエーション選択 */}
      <div className="space-y-4 bg-gray-100 pt-6 pb-6 pl-6 pr-2 rounded-md border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-700">
          📝シチュエーションを選んでください（複数選択可 / {selectedSituations.length}件選択中）
        </h2>
        <div className="border-b border-gray-200 my-2"></div>
        <div className="flex flex-wrap gap-6">
          {selectedDomain && (
            <>
              <div className="w-full flex justify-end mb-2">
                <button
                  onClick={() => {
                    const allSituations = selectedDomain.situations;
                    const isAllSelected = allSituations.every(s => 
                      selectedSituations.some(selected => selected.id === s.id)
                    );
                    const newSelectedSituations = isAllSelected
                      ? selectedSituations.filter(s => 
                          !allSituations.some(situation => situation.id === s.id)
                        )
                      : [...selectedSituations, ...allSituations];
                    setSelectedSituations(newSelectedSituations);
                  }}
                  className={`px-3 py-1 text-sm rounded-full ${
                    selectedDomain.situations.every(s => 
                      selectedSituations.some(selected => selected.id === s.id)
                    )
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {selectedDomain.situations.every(s => 
                    selectedSituations.some(selected => selected.id === s.id)
                  )
                    ? '全て解除'
                    : '全て選択'}
                </button>
              </div>
              {selectedDomain.situations.map((situation) => (
                <button
                  key={situation.id}
                  type="button"
                  style={{ width: '240px' }}
                  onClick={() => handleSituationSelect(situation)}
                  className={`px-4 py-2 rounded border font-medium transition text-center shadow-sm
                    ${selectedSituations.some(s => s.id === situation.id)
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50'}`}
                >
                  {situation.name}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* 次へ進むボタン */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleNext}
          disabled={selectedCharacteristics.length === 0 || !selectedDomain || selectedSituations.length === 0}
          className="px-6 py-3 rounded-full bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors disabled:bg-gray-300 disabled:text-gray-400"
        >
          🎮 次のステージへ
        </button>
      </div>
    </div>
  );
};

export default InitialSelection;
