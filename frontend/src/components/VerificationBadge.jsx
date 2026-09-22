import React from 'react';
import { Cpu, Users, CheckCircle2 } from 'lucide-react';

const VerificationBadge = ({ type = 'Community Reported', className = '' }) => {
  if (type === 'AI Detected' || type === 'AI Detection') {
    return (
      <span
        className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/60 text-amber-300 border border-amber-600/50 shadow-sm ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
        <Cpu className="w-3.5 h-3.5 text-amber-400" />
        <span>🟡 AI Detected</span>
      </span>
    );
  }

  if (type === 'Admin Verified') {
    return (
      <span
        className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/50 shadow-sm ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>🟢 Admin Verified</span>
      </span>
    );
  }

  // Default: Community Reported
  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950/60 text-blue-300 border border-blue-500/50 shadow-sm ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
      <Users className="w-3.5 h-3.5 text-blue-400" />
      <span>🔵 Community Reported</span>
    </span>
  );
};

export default VerificationBadge;
