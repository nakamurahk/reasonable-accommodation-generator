import React from 'react';
import { Link } from 'react-router-dom';

const CommonFooter: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex flex-wrap justify-center gap-6 mb-4">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">ホーム</Link>
              <Link to="/about" className="text-gray-400 hover:text-white transition-colors">合理的配慮とは</Link>
              <Link to="/concept" className="text-gray-400 hover:text-white transition-colors">理念と目指すもの</Link>
              <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">お問い合わせ</Link>
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">プライバシー</Link>
            </div>
        <div className="border-t border-gray-800 pt-4">
          <p className="text-gray-400">&copy; 2025 InclusiBridge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default CommonFooter;
