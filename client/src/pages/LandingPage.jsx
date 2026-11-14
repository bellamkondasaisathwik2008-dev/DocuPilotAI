import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Sparkles, 
  Layers, 
  CheckSquare, 
  HelpCircle, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Database, 
  Terminal, 
  BookOpen, 
  Copy, 
  CheckCircle2 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32">
        
        {/* Radiant Background Blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-8 animate-fadeIn">
            <Sparkles className="h-3.5 w-3.5 text-brand-400" />
            <span>Intelligent Document Processing Powered by Google Gemini 2.5 Flash</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
            Transform Dense Documents Into{' '}
            <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Structured Intelligence
            </span>{' '}
            in Seconds.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Stop drowning in 40-page lecture notes, complex contracts, and technical articles. 
            DocuPilot AI automatically extracts prioritized action items, key entity definitions, 
            executive summaries, risk flags, and active recall review questions.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/login?tab=signup"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-xl shadow-brand-500/25 transition-all hover:scale-105"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/login"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <span>Explore Demo Account</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Machine-Validated JSON Schema
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              PostgreSQL Row Level Security
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Markdown Export & Active Recall
            </span>
          </div>

        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-20 border-t border-slate-900 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-2">
              Core Capabilities
            </h2>
            <p className="text-3xl font-extrabold text-white">
              Built for Students, Legal Teams, Researchers & Executives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-7 hover:border-brand-500/40 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-5 group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Executive Summaries & TL;DR
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Receive crisp, executive takeaways and comprehensive summaries calibrated by output tone and extraction depth.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-7 hover:border-indigo-500/40 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Entity & Term Extraction
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Automatically identifies technical definitions, metrics, stakeholders, and contractual clauses with excerpt contexts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-7 hover:border-emerald-500/40 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
                <CheckSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Prioritized Action Items
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Isolate obligations and next steps categorized by High, Medium, and Low urgency with suggested timelines and owners.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-7 hover:border-amber-500/40 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Active Recall Self-Testing
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Gemini automatically formulates multi-difficulty review questions with expandable answers to test comprehension.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-7 hover:border-rose-500/40 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Risk & Ambiguity Detection
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Surfaces hidden blind spots, unverified assumptions, liability clauses, and gives actionable mitigation remedies.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-7 hover:border-cyan-500/40 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Workspaces & Folders
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Organize notes into hierarchical Workspaces and Folders with PostgreSQL persistence and full-text keyword search.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 border-t border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-2">
              Workflow
            </h2>
            <p className="text-3xl font-extrabold text-white">
              Three Steps to Complete Document Mastery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="relative p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
              <div className="text-3xl font-black text-brand-500/40">01</div>
              <h4 className="text-lg font-bold text-white">Paste or Load Document</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Select your target domain (Lecture Notes, Contract, Technical Paper), choose extraction depth, and paste raw text.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
              <div className="text-3xl font-black text-brand-500/40">02</div>
              <h4 className="text-lg font-bold text-white">Gemini 2.5 Flash Extraction</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Our backend validates incoming requests and invokes Gemini with strict JSON schema constraints for guaranteed structure.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
              <div className="text-3xl font-black text-brand-500/40">03</div>
              <h4 className="text-lg font-bold text-white">Query, Test & Export</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Review interactive quiz cards, track action items, search past reports, and export clean Markdown notes with 1 click.
              </p>
            </div>

          </div>

          {/* Bottom Banner */}
          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-brand-900/40 via-indigo-900/30 to-purple-900/40 border border-brand-500/30 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-bold text-white">Ready to streamline your reading workflow?</h3>
              <p className="text-sm text-slate-300 mt-1">Start processing lecture notes, research papers, and contracts today.</p>
            </div>
            <Link
              to="/login?tab=signup"
              className="px-6 py-3 rounded-xl font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20 shrink-0 transition-transform hover:scale-105"
            >
              Launch DocuPilot AI
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
