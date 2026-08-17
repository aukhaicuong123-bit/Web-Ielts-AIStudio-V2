import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { AppRoute } from '../../types/routes';
import { LearnerProfile } from '../../types';

export interface AppShellProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  profile: LearnerProfile;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentRoute,
  onNavigate,
  profile,
  children
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <div className="flex flex-1 min-h-screen">
        {/* Left Desktop Sidebar */}
        <Sidebar
          currentRoute={currentRoute}
          onNavigate={onNavigate}
          profile={profile}
          className="hidden lg:flex"
        />

        {/* Mobile Navigation Drawer */}
        <MobileNav
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          currentRoute={currentRoute}
          onNavigate={onNavigate}
          profile={profile}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            profile={profile}
            currentRoute={currentRoute}
            onNavigate={onNavigate}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </main>

          {/* Academic Trustworthy Footer */}
          <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">AI IELTS Study Optimizer V2</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-400">Precision Learning Architecture</span>
              </div>
              <div className="text-slate-500 flex items-center gap-2 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Hệ thống học tập dựa trên bằng chứng (Evidence-Based Learning)</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
