import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Search,
  AlertTriangle,
  FileCheck2,
  Users,
  Eye,
  ArrowRight,
  TrendingUp,
  Lock,
  Sparkles,
  ExternalLink,
  DollarSign,
  HelpCircle,
  Repeat,
  CheckSquare,
  Flame,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import api from '../api/client';
import ReportCard from '../components/ReportCard';

const HomePage = () => {
  const [stats, setStats] = useState({
    totalReports: 8,
    verifiedReports: 5,
    websitesAnalyzed: 120,
    totalVotes: 450
  });
  const [recentReports, setRecentReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [statsRes, reportsRes] = await Promise.all([
          api.get('/statistics'),
          api.get('/reports?limit=4&sort=newest')
        ]);
        if (statsRes.data.success) {
          setStats(statsRes.data.stats);
        }
        if (reportsRes.data.success) {
          setRecentReports(reportsRes.data.reports);
        }
      } catch (err) {
        console.warn('Error loading home data:', err.message);
      } finally {
        setLoadingReports(false);
      }
    };
    loadHomeData();
  }, []);

  const commonPatterns = [
    {
      title: 'Hidden Fees & Drip Pricing',
      category: 'Hidden Fee',
      icon: DollarSign,
      desc: 'Ancillary surcharges, convenience markups, or service fees added incrementally at the final checkout step.',
      risk: 'High Risk'
    },
    {
      title: 'Subscription Traps',
      category: 'Subscription Trap',
      icon: Repeat,
      desc: 'Free trials that quietly convert into high recurring charges with buried terms and no notification.',
      risk: 'Critical Risk'
    },
    {
      title: 'Pre-selected Add-ons',
      category: 'Pre-checked Option',
      icon: CheckSquare,
      desc: 'Optional insurance, donations, or warranties defaulted to checked in the shopping cart.',
      risk: 'Moderate Risk'
    },
    {
      title: 'Fake Urgency Clocks',
      category: 'Fake Urgency',
      icon: Flame,
      desc: 'Simulated countdown clocks and fabricated stock warnings designed to provoke impulsive purchasing.',
      risk: 'High Risk'
    }
  ];

  return (
    <div className="space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-purple-600/15 to-transparent blur-3xl pointer-events-none rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-semibold text-cyan-300 shadow-glow-cyan">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span>Next-Gen Consumer Deceptive Design Defense</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Spot Deceptive Design <br />
                <span className="gradient-text-cyan">Before It Costs You.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Report suspicious websites, detect hidden fees, and help the community identify dark patterns.
                Protect your wallet with AI-assisted visual threat analysis and community verification.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/report"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-glow-cyan transition-all transform hover:-translate-y-0.5"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Report a Dark Pattern</span>
                </Link>

                <Link
                  to="/reports"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-cyan-500/50 font-semibold text-sm transition-all"
                >
                  <Search className="w-4 h-4 text-cyan-400" />
                  <span>Explore Reports</span>
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-6 pt-4 text-xs text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Free &amp; Open Public Registry</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Lock className="w-4 h-4 text-purple-400" />
                  <span>Anonymous Reporting Supported</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Cybersecurity Dashboard Illustration */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-6 border border-cyan-500/30 shadow-2xl shadow-cyan-950/40">
                {/* Visual Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400">DARKGUARD-ANALYSIS-AGENT // LIVE</span>
                </div>

                {/* Target Scan Box */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs flex items-center justify-between text-slate-300">
                    <span className="text-slate-500">TARGET:</span>
                    <span className="text-cyan-300 font-semibold">https://checkout-preview.test</span>
                    <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 text-[10px] border border-red-800">
                      FLAGGED
                    </span>
                  </div>

                  {/* Simulated Threat Gauge Card */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">Calculated Risk Index:</span>
                      <span className="font-bold text-red-400 font-mono text-sm">88 / 100 [CRITICAL]</span>
                    </div>

                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-400 to-red-500 h-full w-[88%] rounded-full animate-pulse"></div>
                    </div>

                    <div className="space-y-2 pt-1 text-[11px]">
                      <div className="flex items-center justify-between text-slate-300 bg-slate-950/70 p-2 rounded border border-slate-800">
                        <span className="text-amber-400 font-medium">⚠ Hidden Fee:</span>
                        <span className="text-slate-400 font-mono">+$18.50 final stage markup</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300 bg-slate-950/70 p-2 rounded border border-slate-800">
                        <span className="text-purple-400 font-medium">⚠ Preselected Option:</span>
                        <span className="text-slate-400 font-mono">Default warranty opt-in</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-950/30 border border-cyan-900/50 text-xs text-cyan-300">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      <span>Defensive Action: Deselect opt-in at step 3</span>
                    </div>
                    <Link to="/analyze" className="text-white hover:underline text-[11px] font-bold">
                      Scan URL &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM STATISTICS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          <div className="text-center p-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {stats.totalReports}+
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Total Reports Filed</p>
          </div>
          <div className="text-center p-3 border-l border-slate-800">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              {stats.verifiedReports}+
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Verified Evidence</p>
          </div>
          <div className="text-center p-3 border-l border-slate-800">
            <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
              {stats.websitesAnalyzed}+
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Websites Analyzed</p>
          </div>
          <div className="text-center p-3 border-l border-slate-800">
            <p className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">
              {stats.totalVotes}+
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Community Votes</p>
          </div>
        </div>
      </section>

      {/* 2. WHAT ARE DARK PATTERNS? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-cyan-400 font-mono">
            CONSUMER PROTECTION INTELLIGENCE
          </h2>
          <h3 className="text-3xl font-extrabold text-white">
            What are Dark Patterns?
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Dark patterns are deceptive user interface designs deliberately crafted to trick, coerce, or manipulate consumers into making decisions they wouldn't otherwise make—such as buying unwanted subscriptions, paying surprise fees, or surrendering private data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="cyber-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center font-bold">
              01
            </div>
            <h4 className="text-base font-bold text-white">Financial Exploitation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Concealing the real cost of a purchase until the final payment step, or secretly renewing promotional trial memberships into unannounced billing cycles.
            </p>
          </div>

          <div className="cyber-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              02
            </div>
            <h4 className="text-base font-bold text-white">Cognitive Friction</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Making sign-up effortless with 1 click while forcing users through agonizing multi-step surveys, phone trees, or postal mail just to cancel an account.
            </p>
          </div>

          <div className="cyber-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              03
            </div>
            <h4 className="text-base font-bold text-white">Psychological Coercion</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Using emotional confirmshaming language ("No thanks, I hate saving money") and artificial countdown clocks to induce rushed anxiety.
            </p>
          </div>
        </div>
      </section>

      {/* 3. HOW DARKGUARD WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/70 border border-slate-800 relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              How DarkGuard Works
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              A 3-stage defense mechanism combining crowdsourced intelligence and explainable vision AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-glow-cyan">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">1. Scan &amp; Report</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter a suspicious URL or upload a checkout screenshot. Our scanner analyzes the interface for deceptive cues.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center shadow-glow-purple">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">2. Community Verification</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Consumers vote and corroborate findings with receipts and screenshots. Admins verify legitimate evidence.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">3. Public Defense</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Indexed public reports provide warnings and actionable defense steps to prevent consumers from being deceived.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMMON DARK PATTERNS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-cyan-400 font-mono">
              THREAT TAXONOMY
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Common Dark Patterns
            </h3>
          </div>
          <Link
            to="/analyze"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
          >
            <span>Scan your own suspect site</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {commonPatterns.map((pat) => {
            const Icon = pat.icon;
            return (
              <div
                key={pat.title}
                className="cyber-card cyber-card-hover p-6 rounded-2xl border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                      {pat.risk}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{pat.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{pat.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800">
                  <Link
                    to={`/reports?category=${encodeURIComponent(pat.category)}`}
                    className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                  >
                    <span>Browse {pat.category} reports</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. RECENT COMMUNITY REPORTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-cyan-400 font-mono">
              PUBLIC LOGS
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Recent Community Reports
            </h3>
          </div>
          <Link
            to="/reports"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
          >
            <span>View all reports</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingReports ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-48 rounded-xl bg-slate-900 animate-pulse border border-slate-800"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentReports.map((report) => (
              <ReportCard key={report._id} report={report} />
            ))}
          </div>
        )}
      </section>

      {/* 6. COMMUNITY IMPACT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                COMMUNITY IMPACT &amp; ACCOUNTABILITY
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Together, We're Making the Web Safer &amp; More Transparent
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                By documenting deceptive UI patterns, consumers have prevented thousands of surprise renewals, avoided hidden checkout fees, and created public transparency for regulatory oversight.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div>
                  <div className="text-xl font-extrabold text-emerald-400 font-mono">$18,400+</div>
                  <div className="text-[11px] text-slate-400">Est. Consumer Savings</div>
                </div>
                <div>
                  <div className="text-xl font-extrabold text-cyan-400 font-mono">1,240+</div>
                  <div className="text-[11px] text-slate-400">Traps Avoided</div>
                </div>
                <div>
                  <div className="text-xl font-extrabold text-purple-400 font-mono">100%</div>
                  <div className="text-[11px] text-slate-400">Public &amp; Searchable</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <Sparkles className="w-8 h-8 text-cyan-400 mb-2" />
              <h4 className="text-sm font-bold text-white mb-1">Have you spotted a trap?</h4>
              <p className="text-xs text-slate-400 mb-4">
                Submit screenshots and help other consumers avoid hidden charges.
              </p>
              <Link
                to="/report"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-glow-cyan text-center"
              >
                Submit Evidence Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL-TO-ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center p-12 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-slate-950 border border-cyan-500/20 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-3xl font-extrabold text-white">
              Ready to Expose Deceptive Design?
            </h3>
            <p className="text-sm text-slate-300">
              Join our community of cyber-safety contributors. Analyze suspicious checkouts, upload evidence, and earn reputation badges.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <Link
                to="/analyze"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-glow-cyan hover:from-cyan-400 hover:to-blue-500 transition-all"
              >
                Analyze a Website Now
              </Link>
              <Link
                to="/leaderboard"
                className="px-6 py-3 rounded-xl bg-slate-900 text-slate-200 border border-slate-700 hover:bg-slate-800 font-semibold text-sm transition-all"
              >
                View Top Contributors
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
