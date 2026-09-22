import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Award, FileText, CheckCircle2, ThumbsUp, Calendar, ShieldCheck, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import ReportCard from '../components/ReportCard';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [userReports, setUserReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserReports = async () => {
      try {
        setLoading(true);
        await refreshUser();
        // Fetch reports created by current user
        const res = await api.get('/reports?limit=50');
        if (res.data.success && user) {
          const filtered = res.data.reports.filter(
            (r) => r.userId && r.userId._id === user._id
          );
          setUserReports(filtered);
        }
      } catch (err) {
        console.error('Error fetching profile reports:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchUserReports();
    }
  }, [user?._id]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Please Sign In</h2>
        <p className="text-xs text-slate-400">You must be logged in to access your profile.</p>
        <Link to="/login" className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-semibold">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Card */}
      <div className="cyber-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-700 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold shadow-glow-purple">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-white">{user.name}</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                  {user.role.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</p>
              <div className="flex items-center space-x-1 text-[11px] text-slate-500 mt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:text-right">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block font-mono uppercase">Reputation Points</span>
              <span className="text-2xl font-extrabold text-cyan-400 font-mono">
                {user.reputation || 0} pts
              </span>
            </div>
          </div>
        </div>

        {/* Stats Metrics (Requirement 10) */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Reports Filed</span>
            <span className="text-lg font-bold text-white font-mono">
              {user.stats?.reportsSubmitted || userReports.length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Reports Verified</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">
              {user.stats?.reportsVerified || 0}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Community Votes</span>
            <span className="text-lg font-bold text-amber-400 font-mono">
              {user.stats?.votesCast || 0}
            </span>
          </div>
        </div>

        {/* Badges Display (Requirement 10) */}
        <div className="pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-purple-400" />
            <span>Earned Contributor Badges</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {user.badges && user.badges.length > 0 ? (
              user.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-purple-950/60 text-purple-300 border border-purple-800/80 text-xs font-mono font-semibold"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>{badge}</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">
                Submit your first report to earn the "First Report" badge!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* User's Submitted Reports */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>My Submitted Reports ({userReports.length})</span>
          </h2>
          <Link
            to="/report"
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Report</span>
          </Link>
        </div>

        {loading ? (
          <div className="text-xs text-slate-400 py-6 text-center">Loading your reports...</div>
        ) : userReports.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
            <p className="text-xs text-slate-400">You haven't submitted any dark pattern reports yet.</p>
            <Link
              to="/report"
              className="inline-block px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-glow-cyan"
            >
              Report a Deceptive Website
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userReports.map((report) => (
              <ReportCard key={report._id} report={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
