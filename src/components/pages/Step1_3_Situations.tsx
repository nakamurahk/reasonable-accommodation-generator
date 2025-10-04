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
        
        {/* 説明文 */}
        <div className="bg-light-sand border border-teal-500 rounded-lg p-4 mb-6">
          <p className="text-gray-700 text-base leading-relaxed">
            <span className="font-bold">旅のシーン：困りごとが起きやすい状況は？</span><br />
            先ほど選んだ環境で、あなたの『困りごと』が起きやすい具体的なシーンを選んでください。（複数選択可）
          </p>
        </div>
        
        {/* シチュエーション選択 */}
        <div className="space-y-4 bg-sand pt-4 pb-4 pl-4 pr-2 rounded-md border border-gray-200 shadow-sm">
          
          <div className="flex justify-end">
            <button
              onClick={handleSelectAll}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md hover:bg-gray-200 transition-colors"
            >
              ☑️ すべて選択する
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
      
      {/* 説明文 */}
      <div className="bg-light-sand border border-teal-500 rounded-lg p-6 mb-8">
        <p className="text-gray-700 text-lg leading-relaxed">
          <span className="font-bold">旅のシーン：困りごとが起きやすい状況は？</span><br />
          先ほど選んだ活動場所で、あなたの『困りごと』が起きやすい具体的なシチュエーションを選んでください。（複数選択可）
        </p>
      </div>
      
      {/* シチュエーション選択 */}
      <div className="space-y-4 bg-sand pt-6 pb-6 pl-6 pr-2 rounded-md border border-gray-200 shadow-sm">
        
        <div className="flex justify-end">
          <button
            onClick={handleSelectAll}
            className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-md hover:bg-gray-200 transition-colors"
          >
            よくある場面をすべて選択
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
