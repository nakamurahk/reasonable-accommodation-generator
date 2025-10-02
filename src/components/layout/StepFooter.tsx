import React from 'react';

type StepFooterProps = {
  showBackButton?: boolean;
  onBack?: () => void;
  onNext?: () => void;
  nextButtonText?: string;
  nextButtonDisabled?: boolean;
  isMobile?: boolean;
};

const StepFooter: React.FC<StepFooterProps> = ({
  showBackButton = true,
  onBack,
  onNext,
  nextButtonText = '次のステップへ ➡️',
  nextButtonDisabled = false,
  isMobile = false
}) => {
  const containerClass = isMobile ? 'pt-4' : 'pt-6';
  const buttonClass = isMobile ? 'px-4 py-2' : 'px-6 py-3';
  const flexClass = showBackButton ? 'justify-between' : 'justify-end';

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-sand border-t border-gray-200 shadow-lg z-50`}>
      <div className={`max-w-7xl mx-auto px-4 py-4`}>
        <div className={`flex ${flexClass} items-center`}>
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className={`${buttonClass} bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors`}
            >
              ⬅️ 前のステップへ
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              disabled={nextButtonDisabled}
              className={`${buttonClass} rounded-lg transition-colors ${
                nextButtonDisabled
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-teal-500 text-white hover:bg-teal-600 hover:shadow-md'
              }`}
            >
              {nextButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepFooter;
