import React from 'react';
import { Shield, Lock, Eye, Trash2, FileCheck, CheckCircle2, AlertCircle } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-xs font-semibold text-cyan-400">
          <Shield className="w-3.5 h-3.5" />
          <span>CYBER-TRANSPARENCY CHARTER</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Privacy Policy &amp; Security Principles
        </h1>
        <p className="text-sm text-slate-300">
          Last updated: September 2026. How DarkGuard protects consumer anonymity, stores evidence, and handles data responsibly.
        </p>
      </div>

      <div className="cyber-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
        {/* 1. Data Collection */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>1. What Data We Collect &amp; Why</span>
          </h2>
          <p>
            DarkGuard is built on the philosophy of consumer data minimization. When you submit a report or scan a URL, we collect:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
            <li><strong>Target Web Address (URL):</strong> To catalog the domain exhibiting deceptive interface designs.</li>
            <li><strong>Deceptive UI Description &amp; Screenshots:</strong> To serve as verifiable public evidence for community protection.</li>
            <li><strong>Account Details (Optional):</strong> Your username and email for attributing reputation badges and preventing spam. Anonymous reporting is fully supported for all public filings.</li>
          </ul>
        </section>

        {/* 2. Anonymous Reporting */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Eye className="w-4 h-4 text-purple-400" />
            <span>2. Anonymous Public Reporting &amp; Privacy Safeguards</span>
          </h2>
          <p>
            If you check the "Post report anonymously" option or submit without signing in, your personal identifiers are never associated with the public report card or exposed via our public APIs. Internal security controls (such as hashed IP telemetry) are strictly utilized to prevent vote stuffing and automated denial-of-service abuse.
          </p>
        </section>

        {/* 3. Screenshot Storage */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>3. Screenshot Evidence Handling &amp; Sanitization</span>
          </h2>
          <p>
            Uploaded screenshots are stored in secure object storage with strict MIME-type validation (PNG, JPG, WebP) and a 5MB per-file limit. Users are strongly advised to crop or blur any personal financial credentials (e.g. credit card numbers, home addresses) before submitting. DarkGuard moderators actively redact or remove accidental sensitive disclosures.
          </p>
        </section>

        {/* 4. Ethical Crawling */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>4. Ethical Analysis &amp; Non-Intrusive Scanning</span>
          </h2>
          <p>
            DarkGuard does <strong>not</strong> engage in automated penetration attacks, aggressive vulnerability crawling, or unauthorized server strain. Our URL analyzer only inspects publicly accessible endpoint metadata and user-submitted visual assets. We strictly adhere to standard <code className="text-cyan-400">robots.txt</code> protocols, rate limits, and consumer protection laws.
          </p>
        </section>

        {/* 5. User Deletion Requests */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Trash2 className="w-4 h-4 text-red-400" />
            <span>5. Right to Erasure &amp; Deletion Requests</span>
          </h2>
          <p>
            You have full sovereignty over your account and submitted data. If you wish to delete your account or retract an evidence submission, you can do so directly from your profile or contact our moderation board at <code className="text-cyan-300">privacy@darkguard.test</code>. All associated records will be permanently purged within 48 business hours.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
