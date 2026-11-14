import React, { useEffect, useState } from 'react';
import { Sparkles, Brain, CheckCircle2, ShieldAlert, BookOpen } from 'lucide-react';

const ANALYSIS_STAGES = [
  { icon: Brain, label: 'Reading raw document & parsing lexical tokens...' },
  { icon: Sparkles, label: 'Invoking Gemini 2.5 Flash with strict JSON schema...' },
  { icon: CheckCircle2, label: 'Extracting key entities, definitions & obligations...' },
  { icon: ShieldAlert, label: 'Identifying critical insights & risk/ambiguity flags...' },
  { icon: BookOpen, label: 'Generating active recall review questions & saving to PostgreSQL...' }
];

export default function LoadingSkeleton() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev < ANALYSIS_STAGES.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = ANALYSIS_STAGES[stageIndex].icon;

  return (
    <div className="space-y-6 animate-pulse">
      
      {/* Live Stage Banner */}
      <div className="rounded-xl border border-brand-500/30 bg-gradient-to-r from-brand-950/60 via-slate-900/80 to-brand-950/60 p-4 shadow-lg shadow-brand-500/10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-brand-500/20 border border-brand-500/40 flex items-center justify-center shrink-0">
            <CurrentIcon className="h-5 w-5 text-brand-300 animate-spin" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-xs text-brand-400 font-semibold mb-1">
              <span>STAGE {stageIndex + 1} OF {ANALYSIS_STAGES.length}</span>
              <span>Processing with Gemini 2.5 Flash</span>
            </div>
            <p className="text-sm font-medium text-slate-200 truncate">
              {ANALYSIS_STAGES[stageIndex].label}
            </p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-brand-500 to-indigo-500 h-1.5 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${((stageIndex + 1) / ANALYSIS_STAGES.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Summary Skeleton Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-40 bg-slate-800 rounded-md" />
          <div className="h-4 w-20 bg-slate-800 rounded-full" />
        </div>
        <div className="h-4 w-full bg-slate-800/80 rounded" />
        <div className="h-4 w-11/12 bg-slate-800/70 rounded" />
        <div className="h-4 w-3/4 bg-slate-800/60 rounded" />
      </div>

      {/* Entities Skeleton Grid */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="h-5 w-48 bg-slate-800 rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-slate-700 rounded" />
                <div className="h-3.5 w-12 bg-slate-700/60 rounded-full" />
              </div>
              <div className="h-3 w-full bg-slate-700/50 rounded" />
              <div className="h-3 w-4/5 bg-slate-700/40 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Action Items Skeleton */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
        <div className="h-5 w-44 bg-slate-800 rounded-md" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/20">
            <div className="flex items-center gap-3 w-2/3">
              <div className="h-4 w-4 rounded-full bg-slate-700 shrink-0" />
              <div className="h-3.5 w-full bg-slate-700 rounded" />
            </div>
            <div className="h-4 w-16 bg-slate-700/80 rounded-full" />
          </div>
        ))}
      </div>

    </div>
  );
}
