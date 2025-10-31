import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import SideNav from './components/layout/SideNav';
import AccommodationGenerator from './components/AccommodationGenerator';
import Header from './components/layout/Header';
import MobileHeader from './components/layout/MobileHeader';
import StartPage from './components/pages/StartPage';
import { useIsMobile } from './hooks/useIsMobile';

function App() {
  const isMobile = useIsMobile();
  const [hasStarted, setHasStarted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 初回アクセス時の処理：sessionStorageから状態を復元し、適切に初期化
  useEffect(() => {
    // sessionStorageから状態を復元
    const sessionStarted = sessionStorage.getItem('app_session_started') === 'true';
    setHasStarted(sessionStarted);
    setIsInitialized(true);
  }, []);

  const handleAccommodationComplete = (accommodations: string[]) => {
    
  };

  const handleStart = () => {
    setHasStarted(true);
    sessionStorage.setItem('app_session_started', 'true');
  };

  // 初期化が完了するまで何も表示しない
  if (!isInitialized) {
    return null;
  }

  return (
    <Router basename="/app">
      <AppContent isMobile={isMobile} hasStarted={hasStarted} onStart={handleStart} />
    </Router>
  );
}

function AppContent({ isMobile, hasStarted, onStart }: { isMobile: boolean; hasStarted: boolean; onStart: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  // 初回アクセス時やステップページへの直接アクセス時に、hasStartedがfalseの場合は必ずStartPageにリダイレクト
  useEffect(() => {
    // ルート（/）以外のパスにアクセスしていて、かつhasStartedがfalseの場合
    if (location.pathname !== '/' && !hasStarted) {
      // StartPageにリダイレクト（キャッシュを無視して確実にStartPageを表示）
      navigate('/', { replace: true });
      // sessionStorageもリセット（念のため）
      sessionStorage.removeItem('app_session_started');
      // localStorageもクリア（アプリ側のキャッシュをクリア）
      localStorage.removeItem('accommodation_selections');
    }
  }, [location.pathname, hasStarted, navigate]);

  const handleStart = () => {
    onStart();
    navigate('/step1-1');
  };

  return (
    <Routes>
      {/* アプリのメインページ（同意画面） */}
      <Route path="/" element={<StartPage onStart={handleStart} />} />
      
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
