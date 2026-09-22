import React from 'react';
import {
  DollarSign,
  Repeat,
  CheckSquare,
  MousePointerClick,
  Clock,
  LogOut,
  Frown,
  ArrowLeftRight,
  UserPlus,
  EyeOff,
  AlertCircle
} from 'lucide-react';

const categoryConfig = {
  'Hidden Fee': { icon: DollarSign, color: 'text-rose-400', bg: 'bg-rose-950/40 border-rose-800/50' },
  'Subscription Trap': { icon: Repeat, color: 'text-purple-400', bg: 'bg-purple-950/40 border-purple-800/50' },
  'Pre-checked Option': { icon: CheckSquare, color: 'text-cyan-400', bg: 'bg-cyan-950/40 border-cyan-800/50' },
  'Misleading Button': { icon: MousePointerClick, color: 'text-sky-400', bg: 'bg-sky-950/40 border-sky-800/50' },
  'Fake Urgency': { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-800/50' },
  'Difficult Cancellation': { icon: LogOut, color: 'text-orange-400', bg: 'bg-orange-950/40 border-orange-800/50' },
  'Confirmshaming': { icon: Frown, color: 'text-pink-400', bg: 'bg-pink-950/40 border-pink-800/50' },
  'Bait & Switch': { icon: ArrowLeftRight, color: 'text-yellow-400', bg: 'bg-yellow-950/40 border-yellow-800/50' },
  'Forced Registration': { icon: UserPlus, color: 'text-indigo-400', bg: 'bg-indigo-950/40 border-indigo-800/50' },
  'Privacy Dark Pattern': { icon: EyeOff, color: 'text-teal-400', bg: 'bg-teal-950/40 border-teal-800/50' },
  'Other': { icon: AlertCircle, color: 'text-slate-400', bg: 'bg-slate-800/40 border-slate-700/50' }
};

const CategoryBadge = ({ category = 'Other', className = '' }) => {
  const config = categoryConfig[category] || categoryConfig['Other'];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border ${config.bg} ${config.color} ${className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{category}</span>
    </span>
  );
};

export default CategoryBadge;
