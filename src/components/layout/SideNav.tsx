import React from 'react';

interface SideNavProps {
  currentStep: string;
}

const SideNav: React.FC<SideNavProps> = ({ currentStep }) => {
       const steps = [
         { id: 'step1-1', title: '特性を選ぶ' },
         { id: 'step1-2', title: '環境を選ぶ' },
         { id: 'step1-3', title: 'シチュエーションを選ぶ' },
         { id: 'thinking', title: '探索ステージ' },
         { id: 'deckbuilding', title: '選抜ステージ' },
         { id: 'finalselection', title: '決定ステージ' },
         { id: 'display', title: '確認ステージ' },
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
    <nav className="w-60 h-full bg-sand shadow py-6 px-3 flex flex-col border-r border-gray-200">
      <ul className="space-y-6 pl-3">
        {steps.map((step, idx) => {
          let isCompleted = false;
          let isCurrent = false;
          
          if (step.id.startsWith('step1-')) {
            // ステップ1のサブステップ
            isCompleted = isStep1Completed;
            isCurrent = isStep1Current && step.id === currentStep;
          } else {
            // 他のステップ
            const currentStepIndex = steps.findIndex(s => s.id === currentStep);
            isCompleted = idx < currentStepIndex;
            isCurrent = idx === currentStepIndex;
          }
          
          return (
            <li
              key={step.id}
              className={`
                flex items-center gap-4
                px-3 py-2
                border-l-4
                ${isCurrent
                  ? 'border-teal bg-teal-50 text-teal-800 font-semibold'
                  : isCompleted
                  ? 'border-teal-500 bg-teal-50 text-teal-800 font-semibold'
                  : 'border-transparent bg-sand text-gray-700 font-normal'}
                rounded-r
                transition
              `}
            >
              <span
                className={`
                  w-6 h-6 flex items-center justify-center rounded-full
                  border
                  ${isCurrent
                    ? 'border-teal bg-teal-100 text-teal-800 font-bold'
                    : isCompleted
                    ? 'border-teal-500 bg-teal-100 text-teal-800 font-bold'
                    : 'border-gray-300 bg-sand text-gray-400 font-normal'}
                  text-xs
                `}
              >
                {step.id.startsWith('step1-') ? '①' : idx + 1}
              </span>
              <span className="text-base">{step.title}</span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SideNav;