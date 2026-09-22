import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Flame } from 'lucide-react';

export function getRiskMeta(score) {
  const s = Number(score) || 0;
  if (s <= 25) {
    return {
      level: 'Low',
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/50',
      border: 'border-emerald-800/60',
      icon: ShieldCheck
    };
  }
  if (s <= 50) {
    return {
      level: 'Moderate',
      color: 'text-cyan-400',
      bg: 'bg-cyan-950/50',
      border: 'border-cyan-800/60',
      icon: ShieldAlert
    };
  }
  if (s <= 75) {
    return {
      level: 'High',
      color: 'text-amber-400',
      bg: 'bg-amber-950/50',
      border: 'border-amber-800/60',
      icon: AlertTriangle
    };
  }
  return {
    level: 'Critical',
    color: 'text-red-400',
    bg: 'bg-red-950/50',
    border: 'border-red-800/60',
    icon: Flame
  };
}

const RiskBadge = ({ score, showScore = false, className = '' }) => {
  const meta = getRiskMeta(score);
  const Icon = meta.icon;

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${meta.bg} ${meta.color} ${meta.border} ${className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{meta.level}</span>
      {showScore && <span className="font-mono opacity-80">({score}/100)</span>}
    </span>
  );
};

export default RiskBadge;
