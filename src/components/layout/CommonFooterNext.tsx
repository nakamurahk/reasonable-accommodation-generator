import React from 'react';
import Link from 'next/link';

const CommonFooterNext: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">ホーム</Link>
          <Link href="/about" className="text-gray-400 hover:text-white transition-colors">合理的配慮とは</Link>
          <Link href="/concept" className="text-gray-400 hover:text-white transition-colors">理念と目指すもの</Link>
          <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">お問い合わせ</Link>
          <Link href="/developer" className="text-gray-400 hover:text-white transition-colors">開発者紹介</Link>
          <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">プライバシー</Link>
          <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">利用規約</Link>
        </div>
        <div className="border-t border-gray-800 pt-4">
          <p className="text-gray-400">&copy; 2025 InclusiBridge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default CommonFooterNext;
