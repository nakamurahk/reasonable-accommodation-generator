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
            <Link to="/concept" className="text-gray-700 hover:text-teal-600 transition-colors font-semibold">
              Concept
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
            <div className="fixed inset-0 bg-black bg-opacity-30" onClick={closeMobileMenu}></div>
            <div className="fixed top-0 right-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span className="text-lg font-bold text-gray-900">InclusiBridge</span>
                  </div>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200"
                    aria-label="メニューを閉じる"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Mobile Menu Links */}
                <nav className="flex-1 px-6 py-8 space-y-2">
                  <Link 
                    to="/" 
                    onClick={closeMobileMenu}
                    className="flex items-center px-4 py-4 text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-200 group"
                  >
                    <span className="w-2 h-2 bg-gray-300 rounded-full mr-3 group-hover:bg-teal-500 transition-colors duration-200"></span>
                    Home
                  </Link>
                  <Link 
                    to="/about" 
                    onClick={closeMobileMenu}
                    className="flex items-center px-4 py-4 text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-200 group"
                  >
                    <span className="w-2 h-2 bg-gray-300 rounded-full mr-3 group-hover:bg-teal-500 transition-colors duration-200"></span>
                    About
                  </Link>
                  <Link 
                    to="/concept" 
                    onClick={closeMobileMenu}
                    className="flex items-center px-4 py-4 text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-200 group"
                  >
                    <span className="w-2 h-2 bg-gray-300 rounded-full mr-3 group-hover:bg-teal-500 transition-colors duration-200"></span>
                    Concept
                  </Link>
                  <Link 
                    to="/app" 
                    onClick={closeMobileMenu}
                    className="flex items-center px-4 py-4 text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-200 group"
                  >
                    <span className="w-2 h-2 bg-gray-300 rounded-full mr-3 group-hover:bg-teal-500 transition-colors duration-200"></span>
                    App
                  </Link>
                  <Link 
                    to="/contact" 
                    onClick={closeMobileMenu}
                    className="flex items-center px-4 py-4 text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-200 group"
                  >
                    <span className="w-2 h-2 bg-gray-300 rounded-full mr-3 group-hover:bg-teal-500 transition-colors duration-200"></span>
                    Contact
                  </Link>
                </nav>

                {/* Mobile Menu Footer */}
                <div className="p-6 border-t border-gray-100">
                  <div className="text-xs text-gray-500 text-center">
                    © 2025 InclusiBridge
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default CommonHeader;
