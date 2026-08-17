import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  title,
  className = '',
  ...props
}) => {
  const configs = {
    info: {
      container: 'bg-indigo-50/70 border-indigo-200 text-indigo-900',
      icon: <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
    },
    success: {
      container: 'bg-emerald-50/70 border-emerald-200 text-emerald-900',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
    },
    warning: {
      container: 'bg-amber-50/70 border-amber-200 text-amber-900',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
    },
    error: {
      container: 'bg-rose-50/70 border-rose-200 text-rose-900',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
    }
  };

  const current = configs[variant];

  return (
    <div
      className={`p-4 rounded-xl border flex items-start gap-3 text-sm ${current.container} ${className}`}
      {...props}
    >
      {current.icon}
      <div className="space-y-0.5 flex-1">
        {title && <h4 className="font-bold">{title}</h4>}
        <div className="leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  );
};
