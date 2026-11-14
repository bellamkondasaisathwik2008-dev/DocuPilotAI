import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'brand' }) {
  const colorMap = {
    brand: {
      bg: 'bg-brand-500/10',
      border: 'border-brand-500/20',
      icon: 'text-brand-400',
      hoverBorder: 'hover:border-brand-500/40',
      glow: 'shadow-brand-500/5'
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      icon: 'text-emerald-400',
      hoverBorder: 'hover:border-emerald-500/40',
      glow: 'shadow-emerald-500/5'
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      icon: 'text-amber-400',
      hoverBorder: 'hover:border-amber-500/40',
      glow: 'shadow-amber-500/5'
    },
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      icon: 'text-cyan-400',
      hoverBorder: 'hover:border-cyan-500/40',
      glow: 'shadow-cyan-500/5'
    }
  };

  const scheme = colorMap[color] || colorMap.brand;

  return (
    <div className={`rounded-xl border ${scheme.border} bg-slate-900/60 p-5 backdrop-blur-sm transition-all duration-300 ${scheme.hoverBorder} hover:bg-slate-900/90 shadow-lg ${scheme.glow} group`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold tracking-tight text-white group-hover:scale-105 transition-transform origin-left">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 font-medium truncate max-w-[200px]" title={subtitle}>
              {subtitle}
            </p>
          )}
        </div>
        
        <div className={`p-3 rounded-xl ${scheme.bg} border ${scheme.border} ${scheme.icon} group-hover:rotate-6 transition-transform duration-200`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
