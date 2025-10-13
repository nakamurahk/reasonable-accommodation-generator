import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CommonHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm relative">
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
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
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

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1"
            aria-label="メニューを開く"
          >
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeMobileMenu}></div>
            <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <span className="text-lg font-semibold text-gray-900">メニュー</span>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    aria-label="メニューを閉じる"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Mobile Menu Links */}
                <nav className="flex-1 px-4 py-6 space-y-4">
                  <Link 
                    to="/" 
                    onClick={closeMobileMenu}
                    className="block px-4 py-3 text-lg font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                  >
                    Home
                  </Link>
                  <Link 
                    to="/about" 
                    onClick={closeMobileMenu}
                    className="block px-4 py-3 text-lg font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                  >
                    About
                  </Link>
                  <Link 
                    to="/app" 
                    onClick={closeMobileMenu}
                    className="block px-4 py-3 text-lg font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                  >
                    App
                  </Link>
                  <Link 
                    to="/contact" 
                    onClick={closeMobileMenu}
                    className="block px-4 py-3 text-lg font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                  >
                    Contact
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default CommonHeader;
