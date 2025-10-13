import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SideNav from './components/layout/SideNav';
import AccommodationGenerator from './components/AccommodationGenerator';
import Header from './components/layout/Header';
import MobileHeader from './components/layout/MobileHeader';
import StartPage from './components/pages/StartPage';
import LandingPage from './components/pages/LandingPage';
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';
import ConceptPage from './components/pages/ConceptPage';
import PrivacyPage from './components/pages/PrivacyPage';
import TermsPage from './components/pages/TermsPage';
import { useIsMobile } from './hooks/useIsMobile';

function App() {
  const isMobile = useIsMobile();
  const [hasStarted, setHasStarted] = useState(() => {
    // リロード時にlocalStorageから状態を復元
    return localStorage.getItem('hasStarted') === 'true';
  });

  const handleAccommodationComplete = (accommodations: string[]) => {
    console.log('Accommodations:', accommodations);
  };

  const handleStart = () => {
    setHasStarted(true);
    localStorage.setItem('hasStarted', 'true');
  };

  return (
    <Router>
      <AppContent isMobile={isMobile} hasStarted={hasStarted} onStart={handleStart} />
    </Router>
  );
}

function AppContent({ isMobile, hasStarted, onStart }: { isMobile: boolean; hasStarted: boolean; onStart: () => void }) {
  return (
    <Routes>
      {/* ランディングページ */}
      <Route path="/" element={<LandingPage />} />
      
      {/* アプリページ */}
      <Route path="/app" element={
        hasStarted ? (
          isMobile ? (
            <div className="min-h-screen bg-sand">
              <MobileHeaderWrapper />
              <main>
                <AccommodationGenerator />
              </main>
            </div>
          ) : (
            <div className="h-screen flex flex-col bg-sand">
              <HeaderWrapper />
              <div className="flex-1 flex overflow-hidden">
                <SideNavWrapper />
                <main className="flex-1 overflow-auto">
                  <AccommodationGenerator />
                </main>
              </div>
            </div>
          )
        ) : (
          <StartPage onStart={onStart} />
        )
      } />
      
      {/* アプリのステップページ */}
      <Route path="/step1-1" element={
        hasStarted ? (
          isMobile ? (
            <div className="min-h-screen bg-sand">
              <MobileHeaderWrapper />
              <main>
                <AccommodationGenerator />
              </main>
            </div>
          ) : (
            <div className="h-screen flex flex-col bg-sand">
              <HeaderWrapper />
              <div className="flex-1 flex overflow-hidden">
                <SideNavWrapper />
                <main className="flex-1 overflow-auto">
                  <AccommodationGenerator />
                </main>
              </div>
            </div>
          )
        ) : (
          <StartPage onStart={onStart} />
        )
      } />
      
      <Route path="/step1-2" element={
        hasStarted ? (
          isMobile ? (
            <div className="min-h-screen bg-sand">
              <MobileHeaderWrapper />
              <main>
                <AccommodationGenerator />
              </main>
            </div>
          ) : (
            <div className="h-screen flex flex-col bg-sand">
              <HeaderWrapper />
              <div className="flex-1 flex overflow-hidden">
                <SideNavWrapper />
                <main className="flex-1 overflow-auto">
                  <AccommodationGenerator />
                </main>
              </div>
            </div>
          )
        ) : (
          <StartPage onStart={onStart} />
        )
      } />
      
      <Route path="/step1-3" element={
        hasStarted ? (
          isMobile ? (
            <div className="min-h-screen bg-sand">
              <MobileHeaderWrapper />
              <main>
                <AccommodationGenerator />
              </main>
            </div>
          ) : (
            <div className="h-screen flex flex-col bg-sand">
              <HeaderWrapper />
              <div className="flex-1 flex overflow-hidden">
                <SideNavWrapper />
                <main className="flex-1 overflow-auto">
                  <AccommodationGenerator />
                </main>
              </div>
            </div>
          )
        ) : (
          <StartPage onStart={onStart} />
        )
      } />
      
      <Route path="/step2" element={
        hasStarted ? (
          isMobile ? (
            <div className="min-h-screen bg-sand">
              <MobileHeaderWrapper />
              <main>
                <AccommodationGenerator />
              </main>
            </div>
          ) : (
            <div className="h-screen flex flex-col bg-sand">
              <HeaderWrapper />
              <div className="flex-1 flex overflow-hidden">
                <SideNavWrapper />
                <main className="flex-1 overflow-auto">
                  <AccommodationGenerator />
                </main>
              </div>
            </div>
          )
        ) : (
          <StartPage onStart={onStart} />
        )
      } />
      
      <Route path="/step3" element={
        hasStarted ? (
          isMobile ? (
            <div className="min-h-screen bg-sand">
              <MobileHeaderWrapper />
              <main>
                <AccommodationGenerator />
              </main>
            </div>
          ) : (
            <div className="h-screen flex flex-col bg-sand">
              <HeaderWrapper />
              <div className="flex-1 flex overflow-hidden">
                <SideNavWrapper />
                <main className="flex-1 overflow-auto">
                  <AccommodationGenerator />
                </main>
              </div>
            </div>
          )
        ) : (
          <StartPage onStart={onStart} />
        )
      } />
      
      <Route path="/step4" element={
        hasStarted ? (
          isMobile ? (
            <div className="min-h-screen bg-sand">
              <MobileHeaderWrapper />
              <main>
                <AccommodationGenerator />
              </main>
            </div>
          ) : (
            <div className="h-screen flex flex-col bg-sand">
              <HeaderWrapper />
              <div className="flex-1 flex overflow-hidden">
                <SideNavWrapper />
                <main className="flex-1 overflow-auto">
                  <AccommodationGenerator />
                </main>
              </div>
            </div>
          )
        ) : (
          <StartPage onStart={onStart} />
        )
      } />
      
      <Route path="/step5" element={
        hasStarted ? (
          isMobile ? (
            <div className="min-h-screen bg-sand">
              <MobileHeaderWrapper />
              <main>
                <AccommodationGenerator />
              </main>
            </div>
          ) : (
            <div className="h-screen flex flex-col bg-sand">
              <HeaderWrapper />
              <div className="flex-1 flex overflow-hidden">
                <SideNavWrapper />
                <main className="flex-1 overflow-auto">
                  <AccommodationGenerator />
                </main>
              </div>
            </div>
          )
        ) : (
          <StartPage onStart={onStart} />
        )
      } />
      
      {/* その他のページ */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/concept" element={<ConceptPage />} />
      <Route path="/blog" element={<div className="min-h-screen bg-white p-8"><h1 className="text-2xl">Blog Page</h1></div>} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// URLからステップを取得するヘルパーコンポーネント
function MobileHeaderWrapper() {
  const location = useLocation();
  const getCurrentStep = () => {
    const path = location.pathname;
    if (path === '/step1-1') return 'step1-1';
    if (path === '/step1-2') return 'step1-2';
    if (path === '/step1-3') return 'step1-3';
    if (path === '/step2') return 'thinking';
    if (path === '/step3') return 'deckbuilding';
    if (path === '/step4') return 'finalselection';
    if (path === '/step5') return 'display';
    return 'step1-1';
  };
  
  return <MobileHeader currentStep={getCurrentStep()} />;
}

function HeaderWrapper() {
  const location = useLocation();
  const getCurrentStep = () => {
    const path = location.pathname;
    if (path === '/step1-1') return 'step1-1';
    if (path === '/step1-2') return 'step1-2';
    if (path === '/step1-3') return 'step1-3';
    if (path === '/step2') return 'thinking';
    if (path === '/step3') return 'deckbuilding';
    if (path === '/step4') return 'finalselection';
    if (path === '/step5') return 'display';
    return 'step1-1';
  };
  
  return <Header currentStep={getCurrentStep()} />;
}

function SideNavWrapper() {
  const location = useLocation();
  const getCurrentStep = () => {
    const path = location.pathname;
    if (path === '/step1-1') return 'step1-1';
    if (path === '/step1-2') return 'step1-2';
    if (path === '/step1-3') return 'step1-3';
    if (path === '/step2') return 'thinking';
    if (path === '/step3') return 'deckbuilding';
    if (path === '/step4') return 'finalselection';
    if (path === '/step5') return 'display';
    return 'step1-1';
  };
  
  return <SideNav currentStep={getCurrentStep()} />;
}

export default App;
