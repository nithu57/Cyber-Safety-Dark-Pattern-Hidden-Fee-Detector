import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, ExternalLink, Share2, Calendar, ShieldAlert } from 'lucide-react';
import CategoryBadge from './CategoryBadge';
import RiskBadge from './RiskBadge';
import VerificationBadge from './VerificationBadge';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const ReportCard = ({ report, onVoteUpdated }) => {
  const { isAuthenticated } = useAuth();
  const [votes, setVotes] = useState(report.votesCount || { experienced: 0, disagree: 0 });
  const [userVote, setUserVote] = useState(report.userVote || null);
  const [voting, setVoting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleVote = async (e, type) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please log in or create an account to vote on community reports.');
      return;
    }

    try {
      setVoting(true);
      const res = await api.post(`/reports/${report._id}/vote`, { voteType: type });
      if (res.data.success) {
        setVotes(res.data.votesCount);
        setUserVote(res.data.userVote);
        if (onVoteUpdated) onVoteUpdated(report._id, res.data.votesCount, res.data.userVote);
      }
    } catch (err) {
      alert(err.message || 'Error recording vote');
    } finally {
      setVoting(false);
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/reports/${report._id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formattedDate = report.createdAt
    ? new Date(report.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'Recent';

  return (
    <div className="cyber-card cyber-card-hover rounded-xl overflow-hidden flex flex-col justify-between group border border-slate-800">
      {/* Top Header & Badges */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-3">
          <CategoryBadge category={report.category} />
          <VerificationBadge type={report.verificationBadge} />
        </div>

        {/* Domain & Risk */}
        <div className="flex items-start justify-between gap-3 mt-1">
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center space-x-1.5 break-all">
              <span>{report.domain}</span>
            </h3>
            {report.isDemo && (
              <span className="text-[10px] text-purple-400 font-mono tracking-wider font-semibold">
                [DEMO ENTITY]
              </span>
            )}
          </div>
          <RiskBadge score={report.riskScore} showScore={true} />
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-300 mt-3 line-clamp-3 leading-relaxed">
          {report.description}
        </p>

        {/* Evidence preview box if numbers exist */}
        {(report.evidence?.additionalFee || report.evidence?.subscriptionAmount) && (
          <div className="mt-3 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Undisclosed Markup:</span>
            <span className="font-mono font-bold text-red-400">
              +${report.evidence.additionalFee || report.evidence.subscriptionAmount}
            </span>
          </div>
        )}
      </div>

      {/* Screenshot Thumbnail Preview if available */}
      {report.screenshotUrl && (
        <div className="px-5 py-1">
          <div className="h-28 w-full rounded-lg bg-slate-950 border border-slate-800/80 overflow-hidden relative group/img">
            <img
              src={report.screenshotUrl}
              alt={`Evidence for ${report.domain}`}
              className="w-full h-full object-cover object-top opacity-75 group-hover/img:opacity-100 transition-opacity"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
            <div className="absolute bottom-1.5 left-2 text-[10px] text-slate-400 font-mono">
              Screenshot Evidence Attached
            </div>
          </div>
        </div>
      )}

      {/* Footer & Voting Actions */}
      <div className="p-5 pt-3 border-t border-slate-800/70 mt-3 bg-slate-950/30">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <div className="flex items-center space-x-1 text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{formattedDate}</span>
          </div>
          <div className="text-[11px] font-mono text-cyan-400">
            {votes.experienced} confirmed
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5">
            <button
              onClick={(e) => handleVote(e, 'experienced')}
              disabled={voting}
              title="I experienced this deceptive pattern"
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                userVote === 'experienced'
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                  : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:border-cyan-500/50'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{votes.experienced}</span>
            </button>

            <button
              onClick={(e) => handleVote(e, 'disagree')}
              disabled={voting}
              title="I disagree / Could not reproduce"
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                userVote === 'disagree'
                  ? 'bg-red-950 border-red-500 text-red-300'
                  : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:border-red-500/50'
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>{votes.disagree}</span>
            </button>

            <button
              onClick={handleShare}
              title="Share report"
              className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            {copied && <span className="text-[10px] text-emerald-400 font-mono">Copied!</span>}
          </div>

          <Link
            to={`/reports/${report._id}`}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group-hover:translate-x-0.5 transform duration-150"
          >
            <span>View Details</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
