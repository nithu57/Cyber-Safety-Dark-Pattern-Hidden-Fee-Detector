import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  BarChart3,
  CheckCircle2,
  Users,
  Globe,
  ThumbsUp,
  FileText,
  AlertTriangle,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import api from '../api/client';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/statistics');
        if (res.data.success) {
          setStats(res.data.stats);
          setCharts(res.data.charts);
        }
      } catch (err) {
        console.error('Error fetching statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400">Loading community telemetry &amp; charts...</p>
      </div>
    );
  }

  const customTooltipStyle = {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
    borderRadius: '0.75rem',
    color: '#f8fafc',
    fontSize: '12px'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-xs font-semibold text-cyan-400 mb-2">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>CYBER-SAFETY TELEMETRY HUB</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Community Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Real-time visibility into reported deceptive patterns, platform activity, and risk distributions.
        </p>
      </div>

      {/* Top Telemetry Metric Cards (Requirement 8) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Reports submitted */}
        <div className="cyber-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Reports Submitted</span>
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {stats?.totalReports || 0}
          </p>
          <span className="text-[10px] text-cyan-400 font-mono">Public Crowdsourced</span>
        </div>

        {/* Reports verified */}
        <div className="cyber-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Reports Verified</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            {stats?.verifiedReports || 0}
          </p>
          <span className="text-[10px] text-emerald-400 font-mono">Admin &amp; Evidenced</span>
        </div>

        {/* Active contributors */}
        <div className="cyber-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Contributors</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">
            {stats?.activeContributors || 0}
          </p>
          <span className="text-[10px] text-purple-400 font-mono">Consumer Advocates</span>
        </div>

        {/* Domains reported */}
        <div className="cyber-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Domains Reported</span>
            <Globe className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono">
            {stats?.domainsCount || 0}
          </p>
          <span className="text-[10px] text-blue-400 font-mono">Distinct Sites</span>
        </div>

        {/* Total community votes */}
        <div className="cyber-card p-5 rounded-2xl border border-slate-800 space-y-2 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Community Votes</span>
            <ThumbsUp className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
            {stats?.totalVotes || 0}
          </p>
          <span className="text-[10px] text-amber-400 font-mono">Corroborated Experiences</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Reports by Category */}
        <div className="cyber-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Reports by Deceptive Category</span>
            <span className="text-xs text-slate-400 font-normal">Count</span>
          </h3>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.reportsByCategory || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Reports Over Time */}
        <div className="cyber-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Reporting Trends Over Time</span>
            <span className="text-xs text-slate-400 font-normal">Monthly Submissions</span>
          </h3>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.timeline || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stop-color="#06b6d4" stop-opacity={0.8}/>
                    <stop offset="95%" stop-color="#06b6d4" stop-opacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stop-color="#10b981" stop-opacity={0.8}/>
                    <stop offset="95%" stop-color="#10b981" stop-opacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="reports" stroke="#06b6d4" fillOpacity={1} fill="url(#colorReports)" name="Total Reports" />
                <Area type="monotone" dataKey="verified" stroke="#10b981" fillOpacity={1} fill="url(#colorVerified)" name="Verified" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Top Reported Domains */}
        <div className="cyber-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Top Reported Domains</span>
            <span className="text-xs text-slate-400 font-normal">Fictional Demo Domains</span>
          </h3>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={charts?.topDomains || []}
                margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
              >
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis
                  dataKey="domain"
                  type="category"
                  tick={{ fill: '#f8fafc', fontSize: 11 }}
                  width={120}
                />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="count" fill="#a855f7" radius={[0, 6, 6, 0]} name="Report Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Dark-pattern Severity Distribution */}
        <div className="cyber-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Risk Score Severity Distribution</span>
            <span className="text-xs text-slate-400 font-normal">Low / Mod / High / Crit</span>
          </h3>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.riskDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {(charts?.riskDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
