import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  UploadCloud,
  Cpu,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  ArrowRight,
  Info,
  Loader2,
  FileCheck2
} from 'lucide-react';
import ScreenshotUploader from '../components/ScreenshotUploader';
import RiskScoreGauge from '../components/RiskScoreGauge';
import DarkPatternCard from '../components/DarkPatternCard';
import api from '../api/client';

const AnalyzePage = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [scanStep, setScanStep] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url.trim() && !file) {
      setError('Please provide a website URL or upload a checkout screenshot to analyze.');
      return;
    }

    try {
      setError(null);
      setAnalyzing(true);
      setAnalysisResult(null);

      // Multi-stage scan progress simulation
      setScanStep('Initializing DarkGuard Vision AI...');
      await new Promise((r) => setTimeout(r, 600));
      setScanStep('Inspecting UI components & DOM structure...');
      await new Promise((r) => setTimeout(r, 600));
      setScanStep('Evaluating checkout drip pricing & recurrence traps...');

      const formData = new FormData();
      if (url.trim()) formData.append('url', url.trim());
      if (file) formData.append('screenshot', file);

      const res = await api.post('/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        setAnalysisResult(res.data);
      }
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
      setScanStep('');
    }
  };

  const handleConvertToReport = () => {
    if (!analysisResult) return;
    // Navigate to report page with pre-filled state
    navigate('/report', {
      state: {
        prefillUrl: analysisResult.url || (analysisResult.domain ? `https://${analysisResult.domain}` : ''),
        prefillCategory: analysisResult.patterns?.[0]?.type || 'Hidden Fee',
        prefillDescription: `${analysisResult.summary || 'Detected deceptive design pattern'}.\n\nObserved Evidence:\n${analysisResult.patterns?.map((p) => `• ${p.type}: ${p.evidence}`).join('\n')}`,
        prefillRiskScore: analysisResult.riskScore
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-xs font-semibold text-cyan-400">
          <Cpu className="w-3.5 h-3.5" />
          <span>AI-Assisted Optical &amp; Semantic Analysis</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Analyze a Website
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto">
          Scan suspicious checkout flows, promotional landing pages, or sign-up portals for hidden fees, subscription traps, and manipulative UI elements.
        </p>
      </div>

      {/* Input Scanner Form */}
      <div className="cyber-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        <form onSubmit={handleAnalyze} className="space-y-6">
          {/* URL Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Target Website URL</span>
              <span className="text-[11px] text-slate-500 font-normal">e.g. checkout.example-store.test</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example-site.test/cart/checkout"
                disabled={analyzing}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:opacity-50 font-mono"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full"></div>
            <span className="bg-slate-900 px-3 text-xs text-slate-500 uppercase font-mono absolute">
              OR UPLOAD EVIDENCE SCREENSHOT
            </span>
          </div>

          {/* Screenshot Uploader */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Upload Checkout Screenshot (PNG, JPG, WebP)
            </label>
            <ScreenshotUploader
              file={file}
              onFileSelect={(f) => setFile(f)}
              onFileRemove={() => setFile(null)}
            />
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800/80 text-xs text-red-300 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Scan Button */}
          <button
            type="submit"
            disabled={analyzing || (!url.trim() && !file)}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-glow-cyan disabled:opacity-50 flex items-center justify-center space-x-2 transition-all"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{scanStep || 'Executing Dark Pattern Analysis...'}</span>
              </>
            ) : (
              <>
                <Cpu className="w-4 h-4" />
                <span>Run Dark Pattern Analysis</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Prominent Legal & Assistive Assessment Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-start space-x-3">
        <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-200">Legal Disclaimer &amp; Assessment Scope: </strong>
          DarkGuard automated analysis is an assistive technical assessment designed to flag potential deceptive design indicators, not a definitive judicial or legal fraud determination. Analysis respects website terms and operates strictly on user-submitted artifacts and public inputs.
        </div>
      </div>

      {/* Analysis Results Dashboard */}
      {analysisResult && (
        <div className="space-y-6 pt-6 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                ANALYSIS COMPLETE
              </span>
              <h2 className="text-2xl font-bold text-white mt-0.5">
                Deceptive Design Assessment Report
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Engine: {analysisResult.analysisEngine || 'DarkGuard Vision AI'}
              </p>
            </div>

            <button
              onClick={handleConvertToReport}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-glow-purple transition-all"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Convert to Public Community Report &rarr;</span>
            </button>
          </div>

          {/* Gauge & Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-5 flex justify-center">
              <div className="w-full max-w-sm">
                <RiskScoreGauge
                  score={analysisResult.riskScore}
                  subtitle="Calculated Threat Score"
                />
              </div>
            </div>

            <div className="md:col-span-7 cyber-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-2">
                  Executive Summary
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 font-mono">
                  {analysisResult.summary || 'Deceptive UI heuristics identified potential dark pattern indicators.'}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Risk Severity Level:</span>
                  <span className="font-bold text-white font-mono">
                    {analysisResult.riskLevel}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Identified Pattern Flags:</span>
                  <span className="font-bold text-cyan-400 font-mono">
                    {analysisResult.patterns?.length || 0} Patterns
                  </span>
                </div>
                {analysisResult.domain && (
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Target Domain:</span>
                    <span className="font-mono text-slate-200">
                      {analysisResult.domain}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Screenshot Display if Uploaded */}
          {analysisResult.screenshotUrl && (
            <div className="cyber-card p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Submitted Visual Artifact
              </span>
              <div className="rounded-xl overflow-hidden max-h-96 bg-slate-950 border border-slate-800 flex items-center justify-center">
                <img
                  src={analysisResult.screenshotUrl}
                  alt="Scanned Screenshot"
                  className="max-h-96 w-auto object-contain"
                />
              </div>
            </div>
          )}

          {/* Detected Patterns Cards */}
          <div className="space-y-4 pt-2">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Detected UI Dark Patterns ({analysisResult.patterns?.length || 0})</span>
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {analysisResult.patterns?.map((pattern, idx) => (
                <DarkPatternCard key={idx} pattern={pattern} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyzePage;
