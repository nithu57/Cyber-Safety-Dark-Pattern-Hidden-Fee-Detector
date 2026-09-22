import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Share2,
  ExternalLink,
  ChevronLeft,
  DollarSign,
  AlertTriangle,
  ZoomIn,
  X,
  User,
  CheckCircle2,
  ShieldCheck,
  FileText
} from 'lucide-react';
import api from '../api/client';
import RiskBadge from '../components/RiskBadge';
import CategoryBadge from '../components/CategoryBadge';
import VerificationBadge from '../components/VerificationBadge';
import RiskScoreGauge from '../components/RiskScoreGauge';
import CommentSection from '../components/CommentSection';
import { useAuth } from '../context/AuthContext';

const ReportDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [report, setReport] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [similarReports, setSimilarReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Voting state
  const [voting, setVoting] = useState(false);
  const [votesCount, setVotesCount] = useState({ experienced: 0, disagree: 0 });

  // Modal zoom for screenshot
  const [zoomOpen, setZoomOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/reports/${id}`);
        if (res.data.success) {
          setReport(res.data.report);
          setUserVote(res.data.userVote);
          setVotesCount(res.data.report.votesCount || { experienced: 0, disagree: 0 });
          setSimilarReports(res.data.similarReports || []);
        }
      } catch (err) {
        setError(err.message || 'Report not found');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchDetail();
    }
  }, [id]);

  const handleVote = async (type) => {
    if (!isAuthenticated) {
      alert('Please log in or register an account to vote.');
      return;
    }

    try {
      setVoting(true);
      const res = await api.post(`/reports/${id}/vote`, { voteType: type });
      if (res.data.success) {
        setVotesCount(res.data.votesCount);
        setUserVote(res.data.userVote);
      }
    } catch (err) {
      alert(err.message || 'Failed to submit vote');
    } finally {
      setVoting(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400">Loading comprehensive report dossier...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Report Not Found</h2>
        <p className="text-xs text-slate-400">{error || 'This report may have been deleted or does not exist.'}</p>
        <Link
          to="/reports"
          className="inline-block px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold"
        >
          Return to Reports
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button & quick actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Dossier Header */}
      <div className="cyber-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={report.category} />
              <VerificationBadge type={report.verificationBadge} />
              {report.isDemo && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono font-bold">
                  DEMO RECORD
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight break-all">
              {report.domain}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Reported: {new Date(report.createdAt).toLocaleDateString()}</span>
              </span>
              <span>•</span>
              <span className="text-slate-300">
                Reporter: {report.isAnonymous || !report.userId ? 'Anonymous Consumer' : report.userId.name}
              </span>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center justify-center">
            <div className="w-56">
              <RiskScoreGauge score={report.riskScore} />
            </div>
          </div>
        </div>

        {/* Voting Bar Component (Requirement 7) */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-300">
            <strong className="text-cyan-400 font-bold text-sm font-mono">
              {votesCount.experienced} users
            </strong>{' '}
            experienced this deceptive pattern
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={() => handleVote('experienced')}
              disabled={voting}
              className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                userVote === 'experienced'
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-glow-cyan'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-cyan-500/50'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>👍 I experienced this</span>
            </button>

            <button
              onClick={() => handleVote('disagree')}
              disabled={voting}
              className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                userVote === 'disagree'
                  ? 'bg-red-950 border-red-500 text-red-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-red-500/50'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              <span>👎 I disagree</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Details & Evidence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: What happened & Evidence (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section: What Happened? */}
          <div className="cyber-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>What happened?</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {report.description}
            </p>
          </div>

          {/* Section: Financial & Evidence Breakdown */}
          {(report.evidence?.initialPrice ||
            report.evidence?.finalPrice ||
            report.evidence?.additionalFee ||
            report.evidence?.subscriptionAmount ||
            report.evidence?.cancellationDifficulty) && (
            <div className="cyber-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Financial &amp; Friction Breakdown</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                {report.evidence.initialPrice !== null && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">INITIAL DISPLAYED PRICE</span>
                    <span className="text-sm font-bold text-slate-300">${report.evidence.initialPrice}</span>
                  </div>
                )}
                {report.evidence.finalPrice !== null && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">FINAL STAGE CHARGE</span>
                    <span className="text-sm font-bold text-red-400">${report.evidence.finalPrice}</span>
                  </div>
                )}
                {report.evidence.additionalFee !== null && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">UNDISCLOSED MARKUP</span>
                    <span className="text-sm font-bold text-amber-400">+${report.evidence.additionalFee}</span>
                  </div>
                )}
                {report.evidence.subscriptionAmount !== null && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">RECURRING BILLING</span>
                    <span className="text-sm font-bold text-purple-400">${report.evidence.subscriptionAmount}/mo</span>
                  </div>
                )}
                {report.evidence.cancellationDifficulty && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">CANCELLATION FRICTION</span>
                    <span className="text-sm font-bold text-orange-400">{report.evidence.cancellationDifficulty}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section: Screenshot Evidence */}
          {report.screenshotUrl && (
            <div className="cyber-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-cyan-400" />
                  <span>Visual Evidence Artifact</span>
                </h2>
                <button
                  onClick={() => setZoomOpen(true)}
                  className="inline-flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Zoom Evidence</span>
                </button>
              </div>

              <div
                onClick={() => setZoomOpen(true)}
                className="cursor-pointer rounded-xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-colors relative group"
              >
                <img
                  src={report.screenshotUrl}
                  alt={`Evidence for ${report.domain}`}
                  className="w-full h-auto max-h-96 object-contain"
                />
                <div className="absolute inset-0 bg-cyan-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-lg bg-slate-900/90 text-white text-xs font-bold border border-cyan-500/40">
                    Click to Enlarge
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Section: Detected Dark Patterns Analysis */}
          {report.detectedPatterns && report.detectedPatterns.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white">
                Detected Pattern Indicators ({report.detectedPatterns.length})
              </h2>
              <div className="space-y-3">
                {report.detectedPatterns.map((pat, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{pat.type}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {Math.round((pat.confidence || 0.9) * 100)}% Confidence
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded border border-slate-800/80 font-mono">
                      {pat.evidence}
                    </p>
                    {pat.explanation && (
                      <p className="text-xs text-slate-400">{pat.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Community Discussion */}
          <div className="pt-4 border-t border-slate-800">
            <CommentSection reportId={report._id} />
          </div>
        </div>

        {/* Right Column: Metadata & Similar Reports (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Safety Advisory Card */}
          <div className="cyber-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Consumer Self-Defense Guide</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400">•</span>
                <span>Audit final checkout totals before biometric or CVV entry.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400">•</span>
                <span>Look for pre-ticked add-on checkboxes hidden in cart accordions.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400">•</span>
                <span>Use virtual single-use cards or calendar reminders for trials.</span>
              </li>
            </ul>
          </div>

          {/* Similar Reports */}
          <div className="cyber-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Similar Suspicious Sites
            </h3>

            {similarReports.length === 0 ? (
              <p className="text-xs text-slate-500">No other reports for this category yet.</p>
            ) : (
              <div className="space-y-2.5">
                {similarReports.map((sim) => (
                  <Link
                    key={sim._id}
                    to={`/reports/${sim._id}`}
                    className="block p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white truncate max-w-[150px]">
                        {sim.domain}
                      </span>
                      <RiskBadge score={sim.riskScore} />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{sim.category}</span>
                      <span className="font-mono text-cyan-400">{sim.votesCount?.experienced || 0} confirmed</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Screenshot Zoom Lightbox Modal */}
      {zoomOpen && (
        <div
          onClick={() => setZoomOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setZoomOpen(false)}
              className="absolute -top-12 right-0 p-2 text-slate-300 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={report.screenshotUrl}
              alt="Zoomed evidence"
              className="max-h-[85vh] w-auto object-contain rounded-xl border border-slate-800"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDetailPage;
