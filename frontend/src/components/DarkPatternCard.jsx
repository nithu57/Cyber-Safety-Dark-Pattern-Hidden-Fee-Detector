import React from 'react';
import { ShieldAlert, CheckCircle, Info, Lightbulb, AlertTriangle } from 'lucide-react';
import CategoryBadge from './CategoryBadge';

const DarkPatternCard = ({ pattern }) => {
  const confidencePercent = Math.round((pattern.confidence || 0.85) * 100);

  return (
    <div className="cyber-card rounded-xl p-5 border border-slate-800 space-y-4 hover:border-cyan-500/40 transition-colors">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">
              {pattern.type}
            </h4>
            <span className="text-[11px] text-amber-300 font-medium">
              {pattern.status || 'Potential Deceptive Design Detected'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="text-xs text-slate-400">Confidence:</span>
          <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/80">
            {confidencePercent}%
          </span>
        </div>
      </div>

      {/* Visual Evidence */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center space-x-1">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Observed UI Evidence:</span>
        </div>
        <p className="text-xs text-slate-200 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 font-mono leading-relaxed">
          {pattern.evidence}
        </p>
      </div>

      {/* Explanation */}
      {pattern.explanation && (
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Design Mechanism Analysis:
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {pattern.explanation}
          </p>
        </div>
      )}

      {/* Actionable Consumer Advice */}
      {pattern.recommendedAction && (
        <div className="pt-2 border-t border-slate-800/60 flex items-start space-x-2.5 text-xs text-emerald-300 bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-900/40">
          <Lightbulb className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-emerald-200">Recommended Defense: </strong>
            <span>{pattern.recommendedAction}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DarkPatternCard;
