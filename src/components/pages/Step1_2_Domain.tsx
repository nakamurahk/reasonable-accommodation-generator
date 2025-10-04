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
        
        {/* 説明文 */}
        <div className="bg-light-sand border border-teal-500 rounded-lg p-4 mb-6">
          <p className="text-gray-700 text-base leading-relaxed">
            <span className="font-bold">旅の舞台：サポートが必要な『環境』は？</span><br />
            あなたがサポートを必要としている環境を１つだけ選んで下さい。この選択から、具体的なシーンを次に挙げます。
          </p>
        </div>
        
        {/* 環境選択 */}
        <div className="space-y-4 bg-sand pt-4 pb-4 pl-4 pr-2 rounded-md border border-gray-200 shadow-sm">
          
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
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'bg-white border-white'
                        : 'border-gray-400'
                    }`}>
                      {isSelected && (
                        <div className="w-2.5 h-2.5 bg-teal-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="font-medium flex-1">{domain.name}</div>
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
      
      {/* 説明文 */}
      <div className="bg-light-sand border border-teal-500 rounded-lg p-6 mb-8">
        <p className="text-gray-700 text-lg leading-relaxed">
          <span className="font-bold">旅の舞台：サポートが必要な『環境』は？</span><br />
          あなたがサポートを必要としている環境を１つだけ選んで下さい。この選択から、具体的なシチュエーションを次に挙げます。
        </p>
      </div>
      
      {/* 環境選択 */}
      <div className="space-y-4 bg-sand pt-6 pb-6 pl-6 pr-2 rounded-md border border-gray-200 shadow-sm">
        
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
                <div className="flex items-center space-x-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? 'bg-white border-white'
                      : 'border-gray-400'
                  }`}>
                    {isSelected && (
                      <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                    )}
                  </div>
                  <div className="font-medium text-xl flex-1">{domain.name}</div>
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
