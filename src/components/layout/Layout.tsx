import React from 'react';
import Header from './Header';
import SideNav from './SideNav';

interface LayoutProps {
  currentStep: string;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentStep, children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex h-[calc(100vh-58px)]">
        <SideNav currentStep={currentStep} />
        <main className="flex-1 h-full min-h-0 px-8 py-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout; 