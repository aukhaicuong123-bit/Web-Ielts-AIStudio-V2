import React from 'react';
import { 
  LayoutDashboard, 
  Zap, 
  BookOpen, 
  TrendingUp, 
  User, 
  Activity, 
  ShieldCheck, 
  ChevronRight,
  BrainCircuit,
  PenTool,
  Mountain
} from 'lucide-react';
import { AppRoute } from '../../types/routes';
import { PRIMARY_NAV_ITEMS } from '../navigation/routes';
import { LearnerProfile } from '../../types';

export interface SidebarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  profile: LearnerProfile;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  profile,
  className = ''
}) => {
  const getIcon = (name: string, isActive: boolean) => {
    const iconClass = `w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-800'}`;
    switch (name) {
      case 'LayoutDashboard': return <LayoutDashboard className={iconClass} />;
      case 'Zap': return <Zap className={iconClass} />;
      case 'BookOpen': return <BookOpen className={iconClass} />;
      case 'TrendingUp': return <TrendingUp className={iconClass} />;
      case 'User': return <User className={iconClass} />;
      case 'Mountain': return <Mountain className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-500 group-hover:text-slate-800'}`} />;
      default: return <Activity className={iconClass} />;
    }
  };

  const isItemActive = (route: AppRoute) => {
    if ((route === '/overview' || route === '/dashboard') && (currentRoute === '/overview' || currentRoute === '/dashboard')) {
      return true;
    }
    if (route === '/practice' && (currentRoute === '/practice' || currentRoute === '/practice/reading' || currentRoute === '/practice/writing')) {
      return true;
    }
    if (route === '/today' && (currentRoute === '/today' || currentRoute === '/intervention')) {
      return true;
    }
    if (route === '/progress' && (currentRoute === '/progress' || currentRoute === '/retest')) {
      return true;
    }
    if (route === '/zeroclimber' && (currentRoute === '/zeroclimber' || currentRoute === '/zeroclimber/lesson' || currentRoute === '/zeroclimber/onboarding')) {
      return true;
    }
    return currentRoute === route;
  };

  return (
    <aside className={`w-64 bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0 select-none ${className}`}>
      {/* Brand Top Header */}
      <div>
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
            V2
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-900 leading-tight">
              AI IELTS Optimizer
            </h1>
            <span className="text-[11px] text-slate-400 font-medium block">
              Precision Learning Loop
            </span>
          </div>
        </div>

        {/* Primary Outcome-Oriented Navigation */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Menu chính
          </div>
          {PRIMARY_NAV_ITEMS.map((item) => {
            const active = isItemActive(item.route);
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.route)}
                className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                  active
                    ? 'bg-indigo-50 text-indigo-900 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  {getIcon(item.iconName, active)}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* ZeroClimber Entry Tab */}
          <button
            onClick={() => onNavigate(profile.zeroClimber ? '/zeroclimber' : '/zeroclimber/onboarding')}
            className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition mt-2 ${
              isItemActive('/zeroclimber')
                ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                : 'text-slate-700 hover:bg-emerald-50/60 hover:text-emerald-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Mountain className={`w-5 h-5 ${isItemActive('/zeroclimber') ? 'text-emerald-600' : 'text-emerald-600'}`} />
              <span>ZeroClimber</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
              V0.1
            </span>
          </button>
        </div>

        {/* Practice Quick Sub-links */}
        {(currentRoute.startsWith('/practice') || currentRoute === '/overview') && (
          <div className="px-4 py-2 mt-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Luyện tập có trích xuất lỗi
              </div>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => onNavigate('/practice/reading')}
                  className={`w-full flex items-center justify-between p-2 rounded-lg transition ${
                    currentRoute === '/practice/reading'
                      ? 'bg-white font-bold text-indigo-700 shadow-xs border border-indigo-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Reading Academic</span>
                  </span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </button>

                <button
                  onClick={() => onNavigate('/practice/writing')}
                  className={`w-full flex items-center justify-between p-2 rounded-lg transition ${
                    currentRoute === '/practice/writing'
                      ? 'bg-white font-bold text-indigo-700 shadow-xs border border-indigo-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <PenTool className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Writing & OCR Vision</span>
                  </span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Profile Summary Card */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
              {profile.name ? profile.name.charAt(0) : 'I'}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 truncate max-w-[110px]">
                {profile.name}
              </p>
              <p className="text-[10px] text-slate-400">
                Target Band {profile.targetBand.toFixed(1)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-medium">
              {profile.aiEvidenceEstimate ? 'AI Estimate' : profile.previousOfficialScore ? 'Official' : 'Năng lực'}
            </span>
            <span className="text-xs font-black text-indigo-600 font-mono bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
              {profile.aiEvidenceEstimate 
                ? `Band ${profile.aiEvidenceEstimate.toFixed(1)}` 
                : profile.previousOfficialScore 
                ? `Band ${profile.previousOfficialScore.toFixed(1)}` 
                : 'Chưa test'}
            </span>
          </div>
        </div>

        <button
          onClick={() => onNavigate('/diagnostic')}
          className="w-full mt-2 text-[11px] font-bold text-slate-600 hover:text-indigo-600 bg-white hover:bg-slate-100 border border-slate-200 py-1.5 px-2 rounded-md transition text-center flex items-center justify-center gap-1"
        >
          <BrainCircuit className="w-3 h-3 text-indigo-600" />
          <span>Làm bài chẩn đoán 10 phút</span>
        </button>
      </div>
    </aside>
  );
};
