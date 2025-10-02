import React, { useState } from 'react';
import { CharacteristicType } from '../../types';
// @ts-ignore
import { CHARACTERISTICS } from '../../data/constants';
import { useIsMobile } from '../../hooks/useIsMobile';
import StepFooter from '../layout/StepFooter';

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

type Step1_1_CharacteristicsProps = {
  selectedCharacteristics: CharacteristicType[];
  onCharacteristicsChange: (characteristics: CharacteristicType[]) => void;
  onNext: () => void;
  onBack: () => void;
};

const Step1_1_Characteristics: React.FC<Step1_1_CharacteristicsProps> = ({
  selectedCharacteristics,
  onCharacteristicsChange,
  onNext,
  onBack
}) => {
  const isMobile = useIsMobile();

  // 特性: 複数選択可
  const handleCharacteristicToggle = (characteristic: CharacteristicType) => {
    const isSelected = selectedCharacteristics.find(c => c.id === characteristic.id);
    if (isSelected) {
      onCharacteristicsChange(selectedCharacteristics.filter(c => c.id !== characteristic.id));
    } else {
      onCharacteristicsChange([...selectedCharacteristics, characteristic]);
    }
  };

  const canProceed = selectedCharacteristics.length > 0;

  if (isMobile) {
    return (
      <div className="max-w-none mx-auto p-4 space-y-6">
        {/* 説明文 */}
        <div className="bg-light-sand border border-teal-500 rounded-lg p-4 mb-6">
          <p className="text-gray-700 text-base leading-relaxed">
            <span className="font-bold">旅の準備：あなたの基本情報</span><br />
ここから『困りごとを探す旅』が始まります。まずは、あなたに最適な『サポート』を見つけるための情報を教えてください。
          </p>
        </div>
        
        {/* 特性選択 */}
        <div className="space-y-4 bg-sand pt-4 pb-4 pl-4 pr-2 rounded-md border border-gray-200 shadow-sm">
          <h2 className="text-base font-bold text-gray-700">
            🧠あなたの特性を選んでください<br />
            （複数選択可 / {selectedCharacteristics.length}件選択中）
          </h2>
          <div className="border-b border-gray-200 my-2"></div>
          
          {CHARACTERISTIC_GROUPS.map((group) => (
            <div key={group.label} className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-600">{group.label}</h3>
              <div className="grid grid-cols-1 gap-2">
                {CHARACTERISTICS.filter(char => group.ids.includes(char.id)).map((characteristic) => {
                  const isSelected = selectedCharacteristics.find(c => c.id === characteristic.id);
                  return (
                    <button
                      key={characteristic.id}
                      onClick={() => handleCharacteristicToggle(characteristic)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'bg-teal-500 text-white border-teal-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-teal-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium">{characteristic.name}</div>
                          <div className="text-sm opacity-80">{characteristic.description}</div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 bg-teal-600 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
                            <div className="text-white text-xs font-bold">✓</div>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* フッター */}
        <StepFooter
          showBackButton={false}
          onNext={onNext}
          nextButtonText="次のステップへ ➡️"
          nextButtonDisabled={!canProceed}
          isMobile={true}
        />
      </div>
    );
  }

  // PC版UI
  return (
    <div className="max-w-none mx-auto p-6 space-y-8">
      {/* 説明文 */}
      <div className="bg-light-sand border border-teal-500 rounded-lg p-6 mb-8">
        <p className="text-gray-700 text-lg leading-relaxed">
          <span className="font-bold">旅の準備：あなたの基本情報</span><br />
ここから『困りごとを探す旅』が始まります。まずは、あなたに最適な『サポート』を見つけるための情報を教えてください。<br />
まずは自分の特性を選び、次に環境を決めましょう。選んだ環境に応じて具体的なシチュエーションが現れます。<br />
最後に、困りごとが発生するシチュエーションを複数選択してください。
        </p>
      </div>
      
      {/* 特性選択 */}
      <div className="space-y-4 bg-sand pt-6 pb-6 pl-6 pr-2 rounded-md border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-700">
          🧠あなたの特性を選んでください<br />
          （複数選択可 / {selectedCharacteristics.length}件選択中）
        </h2>
        <div className="border-b border-gray-200 my-4"></div>
        
        {CHARACTERISTIC_GROUPS.map((group) => (
          <div key={group.label} className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-600">{group.label}</h3>
            <div className="grid grid-cols-1 gap-3">
              {CHARACTERISTICS.filter(char => group.ids.includes(char.id)).map((characteristic) => {
                const isSelected = selectedCharacteristics.find(c => c.id === characteristic.id);
                return (
                  <button
                    key={characteristic.id}
                    onClick={() => handleCharacteristicToggle(characteristic)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-teal-500 text-white border-teal-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-lg">{characteristic.name}</div>
                        <div className="text-sm opacity-80">{characteristic.description}</div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
                          <div className="text-white text-sm font-bold">✓</div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* フッター */}
      <StepFooter
        showBackButton={false}
        onNext={onNext}
        nextButtonText="次のステップへ ➡️"
        nextButtonDisabled={!canProceed}
        isMobile={false}
      />
    </div>
  );
};

export default Step1_1_Characteristics;
