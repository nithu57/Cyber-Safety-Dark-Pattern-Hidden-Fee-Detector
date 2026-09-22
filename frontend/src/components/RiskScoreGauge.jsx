import React from 'react';
import { getRiskMeta } from './RiskBadge';

const RiskScoreGauge = ({ score = 50, size = 'md', subtitle = 'Deceptive Risk Index' }) => {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));
  const meta = getRiskMeta(safeScore);

  // SVG Gauge calculations (Semi-circle meter)
  const radius = 60;
  const strokeWidth = 10;
  const circumference = Math.PI * radius; // 180 degrees
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  let strokeColor = '#10b981'; // green
  if (safeScore > 25) strokeColor = '#06b6d4'; // cyan
  if (safeScore > 50) strokeColor = '#f59e0b'; // amber
  if (safeScore > 75) strokeColor = '#ef4444'; // red

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-cyber-card relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: strokeColor }}
      ></div>

      <div className="relative w-44 h-28 flex items-end justify-center">
        <svg viewBox="0 0 150 90" className="w-full h-full overflow-visible">
          {/* Background Track */}
          <path
            d="M 15 80 A 60 60 0 0 1 135 80"
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Colored Progress Arc */}
          <path
            d="M 15 80 A 60 60 0 0 1 135 80"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Central Score Text */}
        <div className="absolute bottom-0 text-center flex flex-col items-center">
          <div className="text-3xl font-extrabold tracking-tight text-white flex items-baseline">
            <span>{safeScore}</span>
            <span className="text-xs text-slate-400 font-mono ml-0.5">/100</span>
          </div>
          <span className={`text-xs font-bold uppercase tracking-wider ${meta.color}`}>
            {meta.level} Risk
          </span>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 mt-2 tracking-wide font-medium">
        {subtitle}
      </p>

      {/* Risk Band Reference Strip */}
      <div className="w-full grid grid-cols-4 gap-1 mt-3 pt-3 border-t border-slate-800/80 text-[9px] text-center font-mono">
        <div className={`py-0.5 rounded ${safeScore <= 25 ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40' : 'text-slate-500'}`}>
          0-25 Low
        </div>
        <div className={`py-0.5 rounded ${safeScore > 25 && safeScore <= 50 ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-500'}`}>
          26-50 Mod
        </div>
        <div className={`py-0.5 rounded ${safeScore > 50 && safeScore <= 75 ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40' : 'text-slate-500'}`}>
          51-75 High
        </div>
        <div className={`py-0.5 rounded ${safeScore > 75 ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/40' : 'text-slate-500'}`}>
          76-100 Crit
        </div>
      </div>
    </div>
  );
};

export default RiskScoreGauge;
