import React from 'react';

interface HeaderProps {
  currentStep?: string;
}

const Header: React.FC<HeaderProps> = ({ currentStep = 'initial' }) => {
       const steps = [
         { id: 'step1-1', title: '特性を選ぶ', short: '①' },
         { id: 'step1-2', title: '環境を選ぶ', short: '①' },
         { id: 'step1-3', title: 'シチュエーションを選ぶ', short: '①' },
         { id: 'thinking', title: '探索', short: '②' },
         { id: 'deckbuilding', title: '選抜', short: '③' },
         { id: 'finalselection', title: '決定', short: '④' },
         { id: 'display', title: '確認', short: '⑤' },
       ];

  // ステップ1の進捗状況を判定（ステップ②のロジックを参考）
  const isStep1Completed = 
    currentStep === 'thinking' ||
    currentStep === 'deckbuilding' ||
    currentStep === 'finalselection' ||
    currentStep === 'display';
  
  const isStep1Current = 
    currentStep === 'step1-1' ||
    currentStep === 'step1-2' ||
    currentStep === 'step1-3';

  return (
    <header className="w-full bg-sand shadow flex items-center justify-between px-4 py-3 relative z-10">
      <div className="flex items-center space-x-2">
        {/* ロゴ部分（SVGや画像に差し替え可） */}
        <span className="text-teal text-2xl font-bold">🧩</span>
        <span className="text-lg font-semibold text-gray-900 hidden sm:block">FitBridge</span>
        <span className="text-lg font-semibold text-gray-900 sm:hidden">FitBridge</span>
      </div>
      
      {/* ステップ表示 */}
      <div className="flex items-center space-x-1">
        {steps.map((step, index) => {
          let isCompleted = false;
          let isCurrent = false;
          
          if (step.id.startsWith('step1-')) {
            // ステップ1のサブステップ
            isCompleted = isStep1Completed;
            isCurrent = isStep1Current && step.id === currentStep;
          } else {
            // 他のステップ
            const currentStepIndex = steps.findIndex(s => s.id === currentStep);
            isCompleted = index < currentStepIndex;
            isCurrent = index === currentStepIndex;
          }
          
          return (
            <div
              key={step.id}
              className={`
                w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold
                ${isCompleted
                  ? 'bg-teal text-white'
                  : isCurrent
                  ? 'bg-teal-100 text-teal-700'
                  : 'bg-gray-200 text-gray-500'}
              `}
              title={step.title}
            >
              {step.short}
            </div>
          );
        })}
      </div>
    </header>
  );
};

export default Header; 