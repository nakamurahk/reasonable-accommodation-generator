import React from 'react';

interface HeaderProps {
  currentStep?: string;
}

const Header: React.FC<HeaderProps> = ({ currentStep = 'initial' }) => {
       const steps = [
         { id: 'initial', title: '出発', short: '①' },
         { id: 'thinking', title: '探索', short: '②' },
         { id: 'deckbuilding', title: '選抜', short: '③' },
         { id: 'finalselection', title: '決定', short: '④' },
         { id: 'display', title: '確認', short: '⑤' },
       ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <header className="w-full bg-white shadow flex items-center justify-between px-4 py-3 relative z-10">
      <div className="flex items-center space-x-2">
        {/* ロゴ部分（SVGや画像に差し替え可） */}
        <span className="text-indigo-600 text-2xl font-bold">🧩</span>
        <span className="text-lg font-semibold text-gray-900 hidden sm:block">合理的配慮ジェネレータ</span>
        <span className="text-lg font-semibold text-gray-900 sm:hidden">配慮ジェネレータ</span>
      </div>
      
      {/* モバイル版ステップ表示 */}
      <div className="flex items-center space-x-1">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`
              w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold
              ${index <= currentStepIndex
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-200 text-gray-500'}
            `}
            title={step.title}
          >
            {step.short}
          </div>
        ))}
      </div>
    </header>
  );
};

export default Header; 