import React from 'react';
import { 
  Sparkles, 
  Compass, 
  BookOpen, 
  PenTool, 
  GitMerge, 
  TrendingUp, 
  Flame, 
  Clock, 
  Award,
  CheckCircle2
} from 'lucide-react';
import { LearnerProfile } from '../types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  profile: LearnerProfile;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, profile }) => {
  const navItems = [
    { id: 'today', label: 'Hôm nay học gì?', icon: Compass, badge: 'Ưu tiên' },
    { id: 'diagnostic', label: 'Diagnostic Test', icon: Sparkles, badge: '10 min' },
    { id: 'reading', label: 'Reading Engine', icon: BookOpen },
    { id: 'writing', label: 'Writing Lab', icon: PenTool },
    { id: 'pathways', label: 'Cross-Skill Pathways', icon: GitMerge, badge: 'Core' },
    { id: 'evidence', label: 'Evidence Proof', icon: TrendingUp },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A] text-white border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('today')}>
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg tracking-tight text-white">
                  AI IELTS Optimizer
                </span>
                <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Precision System
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Tối ưu hóa điểm nghẽn • Đo lường tiến bộ thực chứng bằng Re-test
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hidden md:flex items-center gap-3 text-xs font-medium">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-amber-300">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{profile.streakDays} ngày streak</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-indigo-300">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>{profile.minutesStudiedToday}/{profile.dailyGoalMinutes} phút hôm nay</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Band {profile.currentEstimatedBand.toFixed(1)} ➔ Mục tiêu {profile.targetBand.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
