import React from 'react';

interface HeaderProps {
  currentStep?: string;
}

const Header: React.FC<HeaderProps> = ({ currentStep = 'initial' }) => {
  return (
    <header className="w-full bg-white shadow flex items-center justify-between px-8 py-3 relative z-10">
      <div className="flex items-center space-x-2">
        {/* ロゴ部分（SVGや画像に差し替え可） */}
        <span className="text-indigo-600 text-2xl font-bold">🧩</span>
        <span className="text-xl font-semibold text-gray-900">合理的配慮ジェネレータ</span>
      </div>
      <nav className="flex items-center space-x-6">
        <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium">HOME</a>
        <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium">ABOUT</a>
        <a href="#" className="text-gray-600 hover:text-indigo-600 font-medium">CONTACT</a>
        <button className="ml-4 px-4 py-1 bg-white border border-indigo-200 text-indigo-600 font-semibold rounded shadow-sm hover:bg-indigo-50 transition">ログイン</button>
      </nav>
    </header>
  );
};

export default Header; 