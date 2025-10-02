import React from 'react';

interface MobileHeaderProps {
  currentStep: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ currentStep }) => {
  const getPageTitle = (step: string) => {
    switch (step) {
      case 'step1-1':
        return 'ステップ①：特性を選ぶ';
      case 'step1-2':
        return 'ステップ①：環境を選ぶ';
      case 'step1-3':
        return 'ステップ①：シチュエーションを選ぶ';
      case 'thinking':
        return 'ステップ②：探索（困りごとカードを集める）';
      case 'deckbuilding':
        return 'ステップ③：選抜（困りごとを絞り込む）';
      case 'finalselection':
        return 'ステップ④：決定（最重要の困りごとを決める）';
      case 'display':
        return 'ステップ⑤：確認（配慮案を見る）';
      default:
        return '';
    }
  };

  return (
    <div className="bg-sand border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="text-center">
        <p className="text-base font-medium text-gray-700 mb-3">
          {getPageTitle(currentStep)}
        </p>
        
        {/* プログレスインジケーター */}
        <div className="flex items-center justify-center space-x-1">
          {[1, 2, 3, 4, 5].map((step) => {
            // ステップ1の進捗状況を判定（ステップ②のロジックを参考）
            const isStep1Completed = 
              (currentStep === 'thinking' && step === 1) ||
              (currentStep === 'deckbuilding' && step === 1) ||
              (currentStep === 'finalselection' && step === 1) ||
              (currentStep === 'display' && step === 1);
            
            const isStep1Current = 
              (currentStep === 'step1-1' && step === 1) ||
              (currentStep === 'step1-2' && step === 1) ||
              (currentStep === 'step1-3' && step === 1);
            
            // 他のステップの進捗状況
            const isOtherStepCompleted = 
              (currentStep === 'deckbuilding' && step <= 2) ||
              (currentStep === 'finalselection' && step <= 3) ||
              (currentStep === 'display' && step <= 4);
            
            const isOtherStepCurrent = 
              (currentStep === 'thinking' && step === 2) ||
              (currentStep === 'deckbuilding' && step === 3) ||
              (currentStep === 'finalselection' && step === 4) ||
              (currentStep === 'display' && step === 5);
            
            const isCompleted = isStep1Completed || isOtherStepCompleted;
            const isCurrent = isStep1Current || isOtherStepCurrent;
            
            return (
              <React.Fragment key={step}>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${
                  isCompleted 
                    ? 'bg-teal-500 border-teal-500 text-white' 
                    : isCurrent 
                    ? 'bg-teal-100 border-teal-500 text-teal-700'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 5 && (
                  <div className={`w-4 h-0.5 ${
                    isCompleted ? 'bg-teal-500' : 'bg-gray-300'
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
