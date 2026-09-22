import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, RefreshCw, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/client';
import ReportCard from '../components/ReportCard';

const categories = [
  'All',
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

const riskLevels = ['All', 'Low', 'Moderate', 'High', 'Critical'];

const sortOptions = [
  { label: 'Newest Submissions', value: 'newest' },
  { label: 'Most Voted / Corroborated', value: 'mostVoted' },
  { label: 'Admin Verified First', value: 'verified' },
  { label: 'Highest Risk Score', value: 'highestRisk' }
];

const ReportsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter state
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [riskLevel, setRiskLevel] = useState(searchParams.get('riskLevel') || 'All');
  const [verificationBadge, setVerificationBadge] = useState('All');
  const [sort, setSort] = useState('newest');

  const fetchReports = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 9,
        sort
      };

      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (riskLevel !== 'All') params.riskLevel = riskLevel;
      if (verificationBadge !== 'All') params.verificationBadge = verificationBadge;

      const res = await api.get('/reports', { params });
      if (res.data.success) {
        setReports(res.data.reports);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
        setCurrentPage(res.data.currentPage);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(1);
  }, [category, riskLevel, verificationBadge, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports(1);
  };

  const handleVoteUpdated = (reportId, newVotes, userVote) => {
    setReports((prev) =>
      prev.map((r) => (r._id === reportId ? { ...r, votesCount: newVotes, userVote } : r))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-xs font-semibold text-cyan-400 mb-2">
            <span>PUBLIC SAFETY DIRECTORY</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Community Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse, search, and vote on crowdsourced deceptive website reports.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing <span className="text-cyan-400 font-bold">{reports.length}</span> of {total} indexed reports
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="cyber-card p-5 rounded-2xl border border-slate-800 space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by domain, URL keywords, or exact Report ID..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors flex items-center space-x-1.5"
          >
            <span>Search</span>
          </button>
        </form>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Category Dropdown */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Risk Level */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Risk Severity
            </label>
            <select
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {riskLevels.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Verification Badge Filter */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Badge Type
            </label>
            <select
              value={verificationBadge}
              onChange={(e) => setVerificationBadge(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Badges</option>
              <option value="Admin Verified">Admin Verified</option>
              <option value="Community Reported">Community Reported</option>
              <option value="AI Detected">AI Detected</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {sortOptions.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Matching Reports Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try resetting your filters or search keywords, or report this suspicious site yourself.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <ReportCard
              key={report._id}
              report={report}
              onVoteUpdated={handleVoteUpdated}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-3 pt-6">
          <button
            onClick={() => fetchReports(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs text-slate-400 font-mono">
            Page <strong className="text-white">{currentPage}</strong> of {totalPages}
          </span>

          <button
            onClick={() => fetchReports(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
