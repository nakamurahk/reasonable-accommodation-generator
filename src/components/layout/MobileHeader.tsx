import React from 'react';

interface MobileHeaderProps {
  currentStep: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ currentStep }) => {
  const getPageTitle = (step: string) => {
    switch (step) {
      case 'initial':
        return 'ステップ①：出発';
      case 'thinking':
        return 'ステップ②：探索';
      case 'deckbuilding':
        return 'ステップ③：選抜';
      case 'finalselection':
        return 'ステップ④：決定';
      case 'display':
        return 'ステップ⑤：確認';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="text-center">
        <p className="text-base font-medium text-gray-700 mb-3">
          {getPageTitle(currentStep)}
        </p>
        
        {/* プログレスインジケーター */}
        <div className="flex items-center justify-center space-x-1">
          {[1, 2, 3, 4, 5].map((step) => {
            const stepKey = step === 1 ? 'initial' : step === 2 ? 'thinking' : step === 3 ? 'deckbuilding' : step === 4 ? 'finalselection' : 'display';
            const isCompleted = 
              (currentStep === 'thinking' && step <= 1) ||
              (currentStep === 'deckbuilding' && step <= 2) ||
              (currentStep === 'finalselection' && step <= 3) ||
              (currentStep === 'display' && step <= 4);
            const isCurrent = currentStep === stepKey;
            
            return (
              <React.Fragment key={step}>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${
                  isCompleted 
                    ? 'bg-indigo-500 border-indigo-500 text-white' 
                    : isCurrent 
                    ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 5 && (
                  <div className={`w-4 h-0.5 ${
                    isCompleted ? 'bg-indigo-500' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
