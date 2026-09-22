import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, ExternalLink, Heart, AlertCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#050811] border-t border-slate-800/80 text-slate-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-lg font-bold text-white tracking-wider">
                Dark<span className="text-cyan-400">Guard</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Expose Dark Patterns. Protect Consumers. A crowdsourced cyber-safety intelligence network identifying deceptive design and hidden fees.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Defense Network Active</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/analyze" className="hover:text-cyan-400 transition-colors">Analyze a Website</Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-cyan-400 transition-colors">Public Reports Directory</Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-cyan-400 transition-colors">Report Deceptive Design</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-cyan-400 transition-colors">Community Dashboard</Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-cyan-400 transition-colors">Contributor Leaderboard</Link>
              </li>
            </ul>
          </div>

          {/* Dark Pattern Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Threat Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-slate-300">Hidden Fees &amp; Drip Pricing</span></li>
              <li><span className="hover:text-slate-300">Subscription Traps</span></li>
              <li><span className="hover:text-slate-300">Pre-checked Add-ons</span></li>
              <li><span className="hover:text-slate-300">Confirmshaming Microcopy</span></li>
              <li><span className="hover:text-slate-300">Fake Urgency &amp; Scarcity</span></li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Governance &amp; Trust</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">Safe URL Analysis Rules</span>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">Anti-Spam Protocol</span>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">Moderation Standards</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800/60 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <AlertCircle className="w-4 h-4 text-amber-500/80 flex-shrink-0" />
            <span>
              <strong>Notice:</strong> DarkGuard automated assessments are assistive evaluation aids and community crowdsourced feedback, not legal fraud determinations. Demo entities use <code className="text-slate-300">.test</code> domains.
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center space-x-1">
            <span>&copy; {new Date().getFullYear()} DarkGuard Cyber-Safety Network.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
