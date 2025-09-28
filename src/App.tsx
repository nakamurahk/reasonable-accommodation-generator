import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SideNav from './components/layout/SideNav';
import AccommodationGenerator from './components/AccommodationGenerator';
import Header from './components/layout/Header';
import MobileHeader from './components/layout/MobileHeader';
import { useIsMobile } from './hooks/useIsMobile';

function App() {
  const isMobile = useIsMobile();

  const handleAccommodationComplete = (accommodations: string[]) => {
    console.log('Accommodations:', accommodations);
  };

  return (
    <Router>
      <AppContent isMobile={isMobile} />
    </Router>
  );
}

function AppContent({ isMobile }: { isMobile: boolean }) {
  // モバイル版レイアウト
  if (isMobile) {
    return (
      <div className="min-h-screen bg-sand">
        <MobileHeaderWrapper />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/step1" replace />} />
            <Route path="/step1" element={<AccommodationGenerator />} />
            <Route path="/step2" element={<AccommodationGenerator />} />
            <Route path="/step3" element={<AccommodationGenerator />} />
            <Route path="/step4" element={<AccommodationGenerator />} />
            <Route path="/step5" element={<AccommodationGenerator />} />
          </Routes>
        </main>
      </div>
    );
  }

  // PC版レイアウト（既存のまま）
  return (
    <div className="h-screen flex flex-col bg-sand">
      <HeaderWrapper />
      <div className="flex-1 flex overflow-hidden">
        <SideNavWrapper />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/step1" replace />} />
            <Route path="/step1" element={<AccommodationGenerator />} />
            <Route path="/step2" element={<AccommodationGenerator />} />
            <Route path="/step3" element={<AccommodationGenerator />} />
            <Route path="/step4" element={<AccommodationGenerator />} />
            <Route path="/step5" element={<AccommodationGenerator />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// URLからステップを取得するヘルパーコンポーネント
function MobileHeaderWrapper() {
  const location = useLocation();
  const getCurrentStep = () => {
    const path = location.pathname;
    if (path === '/step1') return 'initial';
    if (path === '/step2') return 'thinking';
    if (path === '/step3') return 'deckbuilding';
    if (path === '/step4') return 'finalselection';
    if (path === '/step5') return 'display';
    return 'initial';
  };
  
  return <MobileHeader currentStep={getCurrentStep()} />;
}

function HeaderWrapper() {
  const location = useLocation();
  const getCurrentStep = () => {
    const path = location.pathname;
    if (path === '/step1') return 'initial';
    if (path === '/step2') return 'thinking';
    if (path === '/step3') return 'deckbuilding';
    if (path === '/step4') return 'finalselection';
    if (path === '/step5') return 'display';
    return 'initial';
  };
  
  return <Header currentStep={getCurrentStep()} />;
}

function SideNavWrapper() {
  const location = useLocation();
  const getCurrentStep = () => {
    const path = location.pathname;
    if (path === '/step1') return 'initial';
    if (path === '/step2') return 'thinking';
    if (path === '/step3') return 'deckbuilding';
    if (path === '/step4') return 'finalselection';
    if (path === '/step5') return 'display';
    return 'initial';
  };
  
  return <SideNav currentStep={getCurrentStep()} />;
}

export default App;
