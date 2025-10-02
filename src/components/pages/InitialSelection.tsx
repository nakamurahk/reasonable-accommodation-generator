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
        <div className="bg-light-sand border border-teal-500 rounded-lg p-4 mb-6">
          <p className="text-gray-700 text-base leading-relaxed">
            <span className="font-bold">🔍 出発のステージ</span><br />
ここから「困りごとを探す旅」が始まります。<br />
まずは自分の特性を選び、次に環境を決めましょう。選んだ環境に応じて具体的なシチュエーションが現れます。<br />
最後に、困りごとが発生するシチュエーションを複数選択してください。
          </p>
        </div>
        
        {/* 特性選択 */}
        <div className="space-y-4 bg-sand pt-4 pb-4 pl-4 pr-2 rounded-md border border-gray-200 shadow-sm">
          <h2 className="text-base font-bold text-gray-700">
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
                        className={`w-full px-4 py-3 rounded border font-medium transition text-center
                          ${selectedCharacteristics.some(c => c.id === char.id)
                            ? 'bg-teal-100 text-teal-500 border border-teal-500 shadow-sm'
                            : 'bg-teal-500 text-white border-teal-500 hover:bg-teal-700 hover:shadow-md'}`}
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
        <div className="space-y-4 bg-sand pt-4 pb-4 pl-4 pr-2 rounded-md border border-gray-200 shadow-sm">
          <h2 className="text-base font-bold text-gray-700">🏢環境を選んでください（1つのみ）</h2>
          <div className="border-b border-gray-200 my-2"></div>
          <div className="grid grid-cols-1 gap-3">
            {DOMAINS.map((domain: any) => (
              <button
                key={domain.id}
                type="button"
                onClick={() => handleDomainSelect(domain)}
                className={`w-full px-4 py-3 rounded border font-medium transition text-center
                  ${selectedDomain?.id === domain.id
                    ? 'bg-teal-100 text-teal-500 border border-teal-500 shadow-sm'
                    : 'bg-teal-500 text-white border-teal-500 hover:bg-teal-700 hover:shadow-md'}`}
              >
                {domain.name}
              </button>
            ))}
          </div>
        </div>

        {/* シチュエーション選択 */}
        <div className="space-y-4 bg-sand pt-4 pb-4 pl-4 pr-2 rounded-md border border-gray-200 shadow-sm">
          <h2 className="text-base font-bold text-gray-700">
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
                        ? 'bg-teal-100 text-teal-700 border border-teal-200'
                        : 'bg-sand text-gray-600 border border-gray-200 hover:bg-gray-200'
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
                    className={`w-full px-4 py-3 rounded border font-medium transition text-center
                      ${selectedSituations.some(s => s.id === situation.id)
                        ? 'bg-teal-100 text-teal-500 border border-teal-500 shadow-sm'
                        : 'bg-teal-500 text-white border-teal-500 hover:bg-teal-700 hover:shadow-md'}`}
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
            className="px-6 py-3 rounded-full bg-teal-500 text-white font-semibold hover:bg-teal-600 hover:shadow-md transition-colors disabled:bg-gray-300 disabled:text-gray-400"
          >
            🎮 次のステップへ
          </button>
        </div>
      </div>
    );
  }

  // PC版UI（既存のまま）
  return (
    <div className="max-w-none mx-auto p-6 space-y-8">
            {/* 説明文 */}
      <div className="bg-light-sand border border-teal-500 rounded-lg p-6 mb-8">
                  <p className="text-gray-700 text-lg leading-relaxed">
            <span className="font-bold">🔍 出発のステージ</span><br />
ここから「困りごとを探す旅」が始まります。<br />
まずは自分の特性を選び、次に環境を決めましょう。選んだ環境に応じて具体的なシチュエーションが現れます。<br />
最後に、困りごとが発生するシチュエーションを複数選択してください。
          </p>
      </div>
      
      {/* 特性選択 */}
      <div className="space-y-4 bg-sand pt-6 pb-6 pl-6 pr-2 rounded-md border border-gray-200 shadow-sm">
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
                      className={`px-4 py-2 h-10 rounded border font-medium transition text-center
                        ${selectedCharacteristics.some(c => c.id === char.id)
                          ? 'bg-teal-100 text-teal-500 border border-teal-500 shadow-sm'
                          : 'bg-teal-500 text-white border-teal-500 hover:bg-teal-700 hover:shadow-md'}`}
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
      <div className="space-y-4 bg-sand pt-6 pb-6 pl-6 pr-2 rounded-md border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-700">🏢環境を選んでください（1つのみ）</h2>
        <div className="border-b border-gray-200 my-2"></div>
        <div className="flex flex-wrap gap-6">
          {DOMAINS.map((domain: any) => (
            <button
              key={domain.id}
              type="button"
              style={{ width: '240px' }}
              onClick={() => handleDomainSelect(domain)}
              className={`px-4 py-2 rounded border font-medium transition text-center
                ${selectedDomain?.id === domain.id
                  ? 'bg-teal-100 text-teal border border-teal shadow-sm'
                  : 'bg-teal-500 text-white border-teal-500 hover:bg-teal-700 hover:shadow-md'}`}
            >
              {domain.name}
            </button>
          ))}
        </div>
      </div>

      {/* シチュエーション選択 */}
      <div className="space-y-4 bg-sand pt-6 pb-6 pl-6 pr-2 rounded-md border border-gray-200 shadow-sm">
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
                      ? 'bg-teal-100 text-teal-700 border border-teal-200'
                      : 'bg-sand text-gray-600 border border-gray-200 hover:bg-gray-200'
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
                  className={`px-4 py-2 rounded border font-medium transition text-center
                    ${selectedSituations.some(s => s.id === situation.id)
                      ? 'bg-teal-100 text-teal-500 border border-teal-500 shadow-sm'
                      : 'bg-teal-500 text-white border-teal-500 hover:bg-teal-700 hover:shadow-md'}`}
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
          className="px-6 py-3 rounded-full bg-teal-500 text-white font-semibold hover:bg-teal-600 hover:shadow-md transition-colors disabled:bg-gray-300 disabled:text-gray-400"
        >
          🎮 次のステップへ
        </button>
      </div>
    </div>
  );
};

export default InitialSelection;
