import React from 'react';
import { LayoutDashboard, Zap, BookOpen, TrendingUp, User, X } from 'lucide-react';
import { AppRoute } from '../../types/routes';
import { PRIMARY_NAV_ITEMS } from '../navigation/routes';
import { LearnerProfile } from '../../types';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  profile: LearnerProfile;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  currentRoute,
  onNavigate,
  profile
}) => {
  const getIcon = (name: string, isActive: boolean) => {
    const iconClass = `w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`;
    switch (name) {
      case 'LayoutDashboard': return <LayoutDashboard className={iconClass} />;
      case 'Zap': return <Zap className={iconClass} />;
      case 'BookOpen': return <BookOpen className={iconClass} />;
      case 'TrendingUp': return <TrendingUp className={iconClass} />;
      case 'User': return <User className={iconClass} />;
      default: return <LayoutDashboard className={iconClass} />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl flex flex-col justify-between p-5 z-50">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                V2
              </div>
              <div>
                <h2 className="font-bold text-sm text-slate-900">AI IELTS Optimizer</h2>
                <span className="text-[10px] text-slate-400">EdTech Learning Engine</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1.5">
            {PRIMARY_NAV_ITEMS.map((item) => {
              const active = currentRoute === item.route;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    onNavigate(item.route);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                    active
                      ? 'bg-indigo-50 text-indigo-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
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
          </div>
        </div>

        {/* Bottom User Info in Mobile Drawer */}
        <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-800">{profile.name}</span>
            <span className="text-indigo-600 font-bold">Band {profile.currentEstimatedBand.toFixed(1)}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Sửa đúng 1 điểm nghẽn hôm nay để tăng điểm thực chất.
          </p>
        </div>
      </div>
    </div>
  );
};
