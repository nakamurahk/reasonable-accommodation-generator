import React, { useState } from 'react';
import { CharacteristicType } from '../../types';
// @ts-ignore
import { CHARACTERISTICS } from '../../data/constants';
import { useIsMobile } from '../../hooks/useIsMobile';
import StepFooter from '../layout/StepFooter';
import { logSelection, logUsage } from '../../lib/analytics';

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

  // 次のステップへ進む時の処理
  const handleNext = () => {
    // 特性選択完了ログ（start段階）- 1回のINSERTで全選択特性を送信
    logUsage('step1-1', 'characteristic_select', {
      action: 'select',
      characteristics: selectedCharacteristics.map(c => c.id)
    });
    
    onNext();
  };

  const canProceed = selectedCharacteristics.length > 0;

  if (isMobile) {
    return (
      <div className="max-w-none mx-auto p-4 space-y-6">
        
        {/* 説明文 */}
        <div className="bg-light-sand border border-teal-500 rounded-lg p-4 mb-6">
          <p className="text-gray-700 text-base leading-relaxed">
            <span className="font-bold">旅の準備：あなたの特性を選ぶ</span><br />
ここから、あなたに合ったサポートを見つける旅が始まります。まずは、特性を教えてください。（複数選択可）
          </p>
        </div>
        
        
        {/* 特性選択 */}
        <div className="space-y-4 bg-sand pt-4 pb-4 pl-4 pr-2 rounded-md border border-gray-200 shadow-sm">
          
          {CHARACTERISTIC_GROUPS.map((group) => (
            <div key={group.label} className="space-y-2">
              <h3 className="text-base font-bold text-gray-800 bg-gray-100 px-3 py-2 rounded-md">{group.label}</h3>
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
                      <div className="flex items-center justify-between h-full">
                        <div className="flex-1">
                          <div className="font-medium">{characteristic.name}</div>
                          <div className="text-sm opacity-80">{characteristic.description}</div>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center ml-1 flex-shrink-0">
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
          onNext={handleNext}
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
          <span className="font-bold">旅の準備：あなたの特性を選ぶ</span><br />
ここから、あなたに合ったサポートを見つける旅が始まります。まずは、特性を教えてください。（複数選択可）
        </p>
      </div>
      
      
      {/* 特性選択 */}
      <div className="space-y-4 bg-sand pt-6 pb-6 pl-6 pr-2 rounded-md border border-gray-200 shadow-sm">
        
        {CHARACTERISTIC_GROUPS.map((group) => (
          <div key={group.label} className="space-y-3">
            <h3 className="text-xl font-bold text-gray-800 bg-gray-100 px-4 py-3 rounded-lg">{group.label}</h3>
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
                    <div className="flex items-center justify-between h-full">
                      <div className="flex-1">
                        <div className="font-medium text-lg">{characteristic.name}</div>
                        <div className="text-sm opacity-80">{characteristic.description}</div>
                      </div>
                      {isSelected && (
                        <div className="w-7 h-7 bg-teal-600 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
                          <div className="text-white text-base font-bold">✓</div>
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
        onNext={handleNext}
        nextButtonText="次のステップへ ➡️"
        nextButtonDisabled={!canProceed}
        isMobile={false}
      />
      
    </div>
  );
};

export default Step1_1_Characteristics;
