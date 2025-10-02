import React, { useState } from 'react';
import { Domain } from '../../types';
// @ts-ignore
import { DOMAINS } from '../../data/constants';
import { useIsMobile } from '../../hooks/useIsMobile';
import StepFooter from '../layout/StepFooter';

type Step1_2_DomainProps = {
  selectedDomain: Domain | null;
  onDomainChange: (domain: Domain | null) => void;
  onNext: () => void;
  onBack: () => void;
};

const Step1_2_Domain: React.FC<Step1_2_DomainProps> = ({
  selectedDomain,
  onDomainChange,
  onNext,
  onBack
}) => {
  const isMobile = useIsMobile();

  const handleDomainSelect = (domain: Domain) => {
    onDomainChange(domain);
  };

  const canProceed = selectedDomain !== null;

  if (isMobile) {
    return (
      <div className="max-w-none mx-auto p-4 space-y-6">
        
        {/* 環境選択 */}
        <div className="space-y-4 bg-sand pt-4 pb-4 pl-4 pr-2 rounded-md border border-gray-200 shadow-sm">
          <h2 className="text-base font-bold text-gray-700">
            🏢環境を選んでください（1つのみ）
          </h2>
          <div className="border-b border-gray-200 my-2"></div>
          
          <div className="grid grid-cols-1 gap-3">
            {DOMAINS.map((domain) => {
              const isSelected = selectedDomain?.id === domain.id;
              return (
                <button
                  key={domain.id}
                  onClick={() => handleDomainSelect(domain)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-teal-500 text-white border-teal-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-teal-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{domain.name}</div>
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
        </div>

        {/* フッター */}
        <StepFooter
          showBackButton={true}
          onBack={onBack}
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
      
      {/* 環境選択 */}
      <div className="space-y-4 bg-sand pt-6 pb-6 pl-6 pr-2 rounded-md border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-700">
          🏢環境を選んでください（1つのみ）
        </h2>
        <div className="border-b border-gray-200 my-4"></div>
        
        <div className="grid grid-cols-1 gap-4">
          {DOMAINS.map((domain) => {
            const isSelected = selectedDomain?.id === domain.id;
            return (
              <button
                key={domain.id}
                onClick={() => handleDomainSelect(domain)}
                className={`p-6 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-teal-500 text-white border-teal-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-teal-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium text-xl">{domain.name}</div>
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
      </div>

      {/* フッター */}
      <StepFooter
        showBackButton={true}
        onBack={onBack}
        onNext={onNext}
        nextButtonText="次のステップへ ➡️"
        nextButtonDisabled={!canProceed}
        isMobile={false}
      />
    </div>
  );
};

export default Step1_2_Domain;
