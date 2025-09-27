import React from 'react';

interface SideNavProps {
  currentStep: string;
}

const SideNav: React.FC<SideNavProps> = ({ currentStep }) => {
       const steps = [
         { id: 'initial', title: '出発ステージ' },
         { id: 'thinking', title: '探索ステージ' },
         { id: 'deckbuilding', title: '選抜ステージ' },
         { id: 'finalselection', title: '決定ステージ' },
         { id: 'display', title: '確認ステージ' },
       ];

  return (
    <nav className="w-60 h-full bg-white shadow py-6 px-3 flex flex-col">
      <ul className="space-y-6 pl-3">
        {steps.map((step, idx) => (
          <li
            key={step.id}
            className={`
              flex items-center gap-4
              px-3 py-2
              border-l-4
              ${currentStep === step.id
                ? 'border-blue-500 bg-blue-50 text-blue-800 font-semibold'
                : 'border-transparent bg-white text-gray-700 font-normal'}
              rounded-r
              transition
            `}
          >
            <span
              className={`
                w-6 h-6 flex items-center justify-center rounded-full
                border
                ${currentStep === step.id
                  ? 'border-blue-500 bg-blue-100 text-blue-800 font-bold'
                  : 'border-gray-300 bg-white text-gray-400 font-normal'}
                text-xs
              `}
            >
              {idx + 1}
            </span>
            <span className="text-base">{step.title}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SideNav;