import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Shield,
  HelpCircle,
  ExternalLink,
  Copy,
  ArrowRight,
  Loader2
} from 'lucide-react';
import ScreenshotUploader from '../components/ScreenshotUploader';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const categories = [
  'Hidden Fee',
  'Subscription Trap',
  'Pre-checked Option',
  'Misleading Button',
  'Fake Urgency',
  'Difficult Cancellation',
  'Confirmshaming',
  'Bait & Switch',
  'Forced Registration',
  'Privacy Dark Pattern',
  'Other'
];

const SubmitReportPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // State prefill from Analyze page if passed
  const prefill = location.state || {};

  const [websiteUrl, setWebsiteUrl] = useState(prefill.prefillUrl || '');
  const [category, setCategory] = useState(prefill.prefillCategory || 'Hidden Fee');
  const [description, setDescription] = useState(prefill.prefillDescription || '');
  const [file, setFile] = useState(null);

  // Optional evidence
  const [initialPrice, setInitialPrice] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [additionalFee, setAdditionalFee] = useState('');
  const [subscriptionAmount, setSubscriptionAmount] = useState('');
  const [cancellationDifficulty, setCancellationDifficulty] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [confirmationAccepted, setConfirmationAccepted] = useState(false);

  // Form submission state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  // Auto calculate additional fee if initial & final price given
  useEffect(() => {
    if (initialPrice && finalPrice) {
      const p1 = parseFloat(initialPrice);
      const p2 = parseFloat(finalPrice);
      if (!isNaN(p1) && !isNaN(p2) && p2 > p1) {
        setAdditionalFee((p2 - p1).toFixed(2));
      }
    }
  }, [initialPrice, finalPrice]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!websiteUrl.trim()) {
      setError('Please provide the website URL.');
      return;
    }

    if (!category) {
      setError('Please select a dark pattern category.');
      return;
    }

    if (!description.trim() || description.trim().length < 20) {
      setError('Please provide a detailed description (at least 20 characters).');
      return;
    }

    if (!confirmationAccepted) {
      setError('You must confirm that this report is based on your experience or publicly accessible information.');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('websiteUrl', websiteUrl.trim());
      formData.append('category', category);
      formData.append('description', description.trim());
      formData.append('confirmationAccepted', 'true');
      formData.append('isAnonymous', isAnonymous ? 'true' : 'false');

      if (file) formData.append('screenshot', file);
      if (initialPrice) formData.append('initialPrice', initialPrice);
      if (finalPrice) formData.append('finalPrice', finalPrice);
      if (additionalFee) formData.append('additionalFee', additionalFee);
      if (subscriptionAmount) formData.append('subscriptionAmount', subscriptionAmount);
      if (cancellationDifficulty) formData.append('cancellationDifficulty', cancellationDifficulty);

      const res = await api.post('/reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        setSubmittedReport(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit report. Please check input.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyReportId = () => {
    if (submittedReport?.reportId && navigator.clipboard) {
      navigator.clipboard.writeText(submittedReport.reportId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  if (submittedReport) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white">Report Successfully Filed</h1>
          <p className="text-sm text-slate-300">
            Thank you for protecting fellow consumers. Your submission is now indexed in the DarkGuard public registry.
          </p>
        </div>

        {/* Report ID Box */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 max-w-md mx-auto flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Report Identification ID</span>
            <span className="font-mono text-cyan-400 font-bold text-sm break-all">
              {submittedReport.reportId}
            </span>
          </div>
          <button
            onClick={copyReportId}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors ml-2"
            title="Copy Report ID"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
        {copiedId && <span className="text-xs text-emerald-400 font-mono">Copied ID to clipboard!</span>}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to={`/reports/${submittedReport.reportId}`}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-glow-cyan"
          >
            View Live Report
          </Link>
          <Link
            to="/reports"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 text-sm font-semibold"
          >
            Back to All Reports
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-xs font-semibold text-cyan-400">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Community Reporting Portal</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Report a Deceptive Website
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Expose hidden charges, subscription roach motels, and manipulative buttons. Your report equips the community to avoid deceptive design traps.
        </p>
      </div>

      {/* Form Card */}
      <div className="cyber-card p-6 sm:p-8 rounded-2xl border border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Website URL */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between">
              <span>Website URL <span className="text-red-400">*</span></span>
              <span className="text-[11px] text-slate-400 font-normal">Include full link or domain</span>
            </label>
            <input
              type="text"
              required
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://suspect-checkout.example/cart"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          {/* Category Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Primary Deceptive Design Category <span className="text-red-400">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Description of Deceptive Behavior <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened... (e.g. When proceeding to checkout, an unexpected $14.99 fee appeared without explanation, or the opt-out button was concealed in faint grey text)"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
            />
          </div>

          {/* Screenshot Uploader */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Upload Screenshot Evidence (Optional but Highly Recommended)
            </label>
            <ScreenshotUploader
              file={file}
              onFileSelect={(f) => setFile(f)}
              onFileRemove={() => setFile(null)}
            />
          </div>

          {/* Optional Pricing & Friction Details Section */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
              <DollarSign className="w-4 h-4" />
              <span>Financial &amp; Cancellation Metrics (Optional)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Price Initially Displayed ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={initialPrice}
                  onChange={(e) => setInitialPrice(e.target.value)}
                  placeholder="e.g. 29.99"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Final Price Demanded ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(e.target.value)}
                  placeholder="e.g. 48.50"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Hidden Ancillary Fee ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={additionalFee}
                  onChange={(e) => setAdditionalFee(e.target.value)}
                  placeholder="e.g. 18.51"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Recurring Subscription Amount ($/mo)</label>
                <input
                  type="number"
                  step="0.01"
                  value={subscriptionAmount}
                  onChange={(e) => setSubscriptionAmount(e.target.value)}
                  placeholder="e.g. 39.99"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Cancellation Difficulty</label>
                <select
                  value={cancellationDifficulty}
                  onChange={(e) => setCancellationDifficulty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">Not Applicable / Unknown</option>
                  <option value="Easy">Easy (1-click settings toggle)</option>
                  <option value="Moderate">Moderate (Multiple confirmation dialogues)</option>
                  <option value="Hard">Hard (Chatbot loop or phone call required)</option>
                  <option value="Near Impossible">Near Impossible (Certified postal mail)</option>
                </select>
              </div>
            </div>
          </div>

          {/* User Options & Verification Checkbox */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="mt-1 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span className="text-xs text-slate-300">
                Post report anonymously (Your username will not be displayed on the public report page).
              </span>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={confirmationAccepted}
                onChange={(e) => setConfirmationAccepted(e.target.checked)}
                className="mt-1 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                I confirm that this report is based on my own experience or publicly accessible information.
              </span>
            </label>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800/80 text-xs text-red-300">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-glow-cyan disabled:opacity-50 flex items-center justify-center space-x-2 transition-all"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing &amp; Validating Report...</span>
              </>
            ) : (
              <span>Submit Report</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitReportPage;
