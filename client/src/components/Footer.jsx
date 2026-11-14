import React from 'react';
import { FileText, Cpu, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-900 bg-slate-950 py-10 mt-auto text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-brand-600/30 flex items-center justify-center border border-brand-500/30">
              <FileText className="h-4 w-4 text-brand-400" />
            </div>
            <span className="font-semibold text-slate-200">DocuPilot AI</span>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-slate-500">
              Intelligent Document Processing & Knowledge Extraction
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-brand-400" />
              Powered by <strong className="text-slate-300">Gemini 2.5 Flash</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Supabase PostgreSQL RLS Protected
            </span>
          </div>

          <div className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} DocuPilot AI. Production-Ready IDP Architecture.
          </div>

        </div>
      </div>
    </footer>
  );
}
