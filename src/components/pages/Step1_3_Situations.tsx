import React, { useState } from 'react';
import { Situation } from '../../types';
import { useIsMobile } from '../../hooks/useIsMobile';
import StepFooter from '../layout/StepFooter';

type Step1_3_SituationsProps = {
  selectedSituations: Situation[];
  onSituationsChange: (situations: Situation[]) => void;
  onComplete: () => void;
  onBack: () => void;
  selectedDomain: any; // Domain type
};

const Step1_3_Situations: React.FC<Step1_3_SituationsProps> = ({
  selectedSituations,
  onSituationsChange,
  onComplete,
  onBack,
  selectedDomain
}) => {
  const isMobile = useIsMobile();

  // シチュエーション: 複数選択可
  const handleSituationToggle = (situation: Situation) => {
    const isSelected = selectedSituations.find(s => s.id === situation.id);
    if (isSelected) {
      onSituationsChange(selectedSituations.filter(s => s.id !== situation.id));
    } else {
      onSituationsChange([...selectedSituations, situation]);
    }
  };

  const handleSelectAll = () => {
    onSituationsChange([...availableSituations]);
  };

  const canProceed = selectedSituations.length > 0;

  // 選択されたドメインに基づいてシチュエーションを取得
  const availableSituations = selectedDomain?.situations || [];

  if (isMobile) {
    return (
      <div className="max-w-none mx-auto p-4 space-y-6">
        
        {/* シチュエーション選択 */}
        <div className="space-y-4 bg-sand pt-4 pb-4 pl-4 pr-2 rounded-md border border-gray-200 shadow-sm">
          <h2 className="text-base font-bold text-gray-700">
            📝シチュエーションを選んでください<br />
            （複数選択可 / {selectedSituations.length}件選択中）
          </h2>
          <div className="border-b border-gray-200 my-2"></div>
          
          <div className="flex justify-end">
            <button
              onClick={handleSelectAll}
              className="px-3 py-1 bg-teal-500 text-white text-sm rounded-lg hover:bg-teal-600 transition-colors"
            >
              全部選択する
            </button>
          </div>
          
          {availableSituations.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {availableSituations.map((situation: Situation) => {
                const isSelected = selectedSituations.find(s => s.id === situation.id);
                return (
                  <button
                    key={situation.id}
                    onClick={() => handleSituationToggle(situation)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-teal-500 text-white border-teal-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{situation.name}</div>
                      {isSelected && (
                        <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                          <div className="text-white text-sm font-bold">✓</div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              選択された環境に対応するシチュエーションがありません。
            </div>
          )}
        </div>

        {/* フッター */}
        <StepFooter
          showBackButton={true}
          onBack={onBack}
          onNext={onComplete}
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
      
      {/* シチュエーション選択 */}
      <div className="space-y-4 bg-sand pt-6 pb-6 pl-6 pr-2 rounded-md border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-700">
          📝シチュエーションを選んでください<br />
          （複数選択可 / {selectedSituations.length}件選択中）
        </h2>
        <div className="border-b border-gray-200 my-4"></div>
        
        <div className="flex justify-end">
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            全部選択する
          </button>
        </div>
        
        {availableSituations.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {availableSituations.map((situation: Situation) => {
              const isSelected = selectedSituations.find(s => s.id === situation.id);
              return (
                <button
                  key={situation.id}
                  onClick={() => handleSituationToggle(situation)}
                  className={`p-6 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-teal-500 text-white border-teal-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-teal-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-xl">{situation.name}</div>
                    {isSelected && (
                      <div className="w-7 h-7 bg-teal-600 rounded-full flex items-center justify-center">
                        <div className="text-white text-base font-bold">✓</div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 text-lg">
            選択された環境に対応するシチュエーションがありません。
          </div>
        )}
      </div>

      {/* フッター */}
      <StepFooter
        showBackButton={true}
        onBack={onBack}
        onNext={onComplete}
        nextButtonText="次のステップへ ➡️"
        nextButtonDisabled={!canProceed}
        isMobile={false}
      />
    </div>
  );
};

export default Step1_3_Situations;
