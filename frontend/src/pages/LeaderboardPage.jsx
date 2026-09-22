import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Star, ShieldCheck, Flame, Info, CheckCircle2 } from 'lucide-react';
import api from '../api/client';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await api.get('/leaderboard');
        if (res.data.success) {
          setLeaderboard(res.data.leaderboard);
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold font-mono">
          <Trophy className="w-4 h-4 text-amber-400" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-slate-300/20 text-slate-300 border border-slate-400/40 flex items-center justify-center font-bold font-mono">
          <Medal className="w-4 h-4 text-slate-300" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-amber-700/20 text-amber-600 border border-amber-700/40 flex items-center justify-center font-bold font-mono">
          <Medal className="w-4 h-4 text-amber-500" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center justify-center font-bold text-xs font-mono">
        #{rank}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-xs font-semibold text-purple-400">
          <Trophy className="w-3.5 h-3.5" />
          <span>COMMUNITY GUARDIAN REPUTATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Contributor Leaderboard
        </h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Honoring the consumer champions exposing deceptive design, verifying evidence, and protecting users across the digital ecosystem.
        </p>
      </div>

      {/* Points & Badges System Guide */}
      <div className="cyber-card p-6 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center space-x-1.5">
            <Award className="w-4 h-4" />
            <span>How Points are Earned</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
              <span>Submitting a verified dark pattern report:</span>
              <span className="font-mono text-cyan-400 font-bold">+15 pts</span>
            </li>
            <li className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
              <span>Providing attached screenshot evidence:</span>
              <span className="font-mono text-cyan-400 font-bold">+10 pts</span>
            </li>
            <li className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
              <span>Admin verification of deceptive finding:</span>
              <span className="font-mono text-emerald-400 font-bold">+25 pts</span>
            </li>
            <li className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
              <span>Helpful community corroboration comment:</span>
              <span className="font-mono text-purple-400 font-bold">+3 pts</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Anti-Spam Safeguards &amp; Badges</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            To prevent spam gaming, points are only finalized when reports are reviewed by moderators or corroborated by authenticated users.
          </p>
          <div className="flex flex-wrap gap-2 text-[11px] font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-blue-950 text-blue-300 border border-blue-800">
              First Report
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-purple-950 text-purple-300 border border-purple-800">
              Evidence Expert
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800">
              Community Guardian
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800">
              Verified Contributor
            </span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="cyber-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Top Advocates
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Ranked by Reputation
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading rankings...</div>
        ) : (
          <div className="divide-y divide-slate-800">
            {leaderboard.map((item) => (
              <div
                key={item._id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/50 transition-colors"
              >
                {/* Left: Rank, Avatar & Name */}
                <div className="flex items-center space-x-4">
                  {getRankBadge(item.rank)}

                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {item.name ? item.name.charAt(0).toUpperCase() : 'U'}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                      {item.rank <= 3 && (
                        <span className="text-[10px] text-amber-400 font-bold">★ TOP TIER</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {item.badges?.map((badge, bidx) => (
                        <span
                          key={bidx}
                          className="text-[10px] px-2 py-0.2 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Reports & Reputation */}
                <div className="flex items-center space-x-6 sm:text-right pl-12 sm:pl-0">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">
                      Verified Reports
                    </span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      {item.verifiedReports || 0}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">
                      Reputation Points
                    </span>
                    <span className="text-base font-extrabold text-cyan-400 font-mono">
                      {item.reputation} pts
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
