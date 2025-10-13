import React from 'react';
import { Link } from 'react-router-dom';

const CommonHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            {/* Logo + Text Image */}
            <img 
              src="/logo.png" 
              alt="InclusiBridge - 合理的配慮を支援するWebツール"
              className="h-16"
              loading="eager"
            />
          </Link>
          
          <nav className="flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-teal-600 transition-colors font-semibold">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-teal-600 transition-colors font-semibold">
              About
            </Link>
            <Link to="/app" className="text-gray-700 hover:text-teal-600 transition-colors font-semibold">
              App
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-teal-600 transition-colors font-semibold">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default CommonHeader;
