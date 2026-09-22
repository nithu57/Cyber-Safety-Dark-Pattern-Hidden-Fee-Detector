import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Trash2,
  AlertTriangle,
  ExternalLink,
  Eye,
  Filter,
  RefreshCw,
  Search,
  Check,
  ShieldAlert
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import RiskBadge from '../components/RiskBadge';
import CategoryBadge from '../components/CategoryBadge';
import VerificationBadge from '../components/VerificationBadge';

const AdminPage = () => {
  const { user, isAdmin } = useAuth();
  const [reports, setReports] = useState([]);
  const [metrics, setMetrics] = useState({
    pending: 0,
    underReview: 0,
    verified: 0,
    rejected: 0,
    flagged: 0,
    total: 0
  });
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const fetchAdminReports = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      const res = await api.get('/admin/reports', { params });
      if (res.data.success) {
        setReports(res.data.reports);
        setMetrics(res.data.metrics);
      }
    } catch (err) {
      console.error('Error loading admin reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminReports();
    }
  }, [isAdmin, statusFilter]);

  const handleVerify = async (reportId) => {
    try {
      setActionLoading(reportId);
      const res = await api.put(`/admin/reports/${reportId}/verify`);
      if (res.data.success) {
        setFeedback({ type: 'success', message: 'Report officially verified!' });
        fetchAdminReports();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (reportId) => {
    try {
      setActionLoading(reportId);
      const res = await api.put(`/admin/reports/${reportId}/reject`);
      if (res.data.success) {
        setFeedback({ type: 'warning', message: 'Report rejected.' });
        fetchAdminReports();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteSpam = async (reportId) => {
    if (!window.confirm('Are you sure you want to permanently purge this report as spam?')) {
      return;
    }
    try {
      setActionLoading(reportId);
      const res = await api.delete(`/admin/reports/${reportId}`);
      if (res.data.success) {
        setFeedback({ type: 'success', message: 'Spam entry permanently purged.' });
        fetchAdminReports();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Restricted Access</h2>
        <p className="text-xs text-slate-400">
          This panel is restricted to verified DarkGuard administrators and moderators.
        </p>
        <Link to="/login" className="inline-block px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-semibold">
          Admin Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-xs font-semibold text-amber-400 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>OPERATIONS &amp; MODERATION CONTROL</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Admin Verification Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Review user submitted evidence, verify dark pattern findings, and purge spam submissions.
          </p>
        </div>

        <button
          onClick={fetchAdminReports}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Metrics Grid (Requirement 11) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Pending Review</span>
          <span className="text-2xl font-bold text-amber-400 font-mono">{metrics.pending}</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Under Review</span>
          <span className="text-2xl font-bold text-cyan-400 font-mono">{metrics.underReview}</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Admin Verified</span>
          <span className="text-2xl font-bold text-emerald-400 font-mono">{metrics.verified}</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Rejected</span>
          <span className="text-2xl font-bold text-red-400 font-mono">{metrics.rejected}</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Flagged Activity</span>
          <span className="text-2xl font-bold text-purple-400 font-mono">{metrics.flagged}</span>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
              : 'bg-amber-950/60 border-amber-800 text-amber-300'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white ml-2">
            &times;
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {['All', 'Pending', 'Under Review', 'Verified', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === status
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Reports Table / Review Queue */}
      <div className="cyber-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] text-slate-400 font-mono uppercase">
              <tr>
                <th className="p-4">Target Website &amp; Category</th>
                <th className="p-4">Risk Score</th>
                <th className="p-4">Current Status</th>
                <th className="p-4">Evidence</th>
                <th className="p-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    Loading queue...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    No reports in this filter category.
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white text-sm break-all">
                        {report.domain}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <CategoryBadge category={report.category} />
                        <span className="text-[10px] text-slate-500 font-mono">
                          ID: {report._id.slice(-6)}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 font-mono">
                      <RiskBadge score={report.riskScore} showScore={true} />
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded text-[11px] font-semibold font-mono ${
                          report.status === 'Verified'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : report.status === 'Pending'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : report.status === 'Under Review'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                            : 'bg-red-950 text-red-300 border border-red-800'
                        }`}
                      >
                        {report.status}
                      </span>
                    </td>

                    <td className="p-4">
                      {report.screenshotUrl ? (
                        <a
                          href={report.screenshotUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 text-cyan-400 hover:underline"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Screenshot</span>
                        </a>
                      ) : (
                        <span className="text-slate-500">Text only</span>
                      )}
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <Link
                        to={`/reports/${report._id}`}
                        target="_blank"
                        className="inline-flex items-center p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                        title="Inspect dossier"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      {report.status !== 'Verified' && (
                        <button
                          onClick={() => handleVerify(report._id)}
                          disabled={actionLoading === report._id}
                          className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 font-semibold"
                          title="Verify as legitimate dark pattern"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Verify</span>
                        </button>
                      )}

                      {report.status !== 'Rejected' && (
                        <button
                          onClick={() => handleReject(report._id)}
                          disabled={actionLoading === report._id}
                          className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 font-semibold"
                          title="Reject report"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteSpam(report._id)}
                        disabled={actionLoading === report._id}
                        className="inline-flex items-center p-1.5 rounded-lg bg-red-950 hover:bg-red-900 border border-red-800 text-red-400"
                        title="Purge spam permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
