import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Calendar, 
  Clock, 
  Tag, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  CheckSquare, 
  Layers 
} from 'lucide-react';

export default function DocumentCard({ doc, onDelete }) {
  const getCategoryBadge = (category) => {
    switch (category) {
      case 'Academic & Lecture Notes':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Research Paper & Technical Article':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Legal & Contract Document':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Business & Meeting Transcript':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Financial & Invoice Record':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'General Document':
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const actionItemCount = doc.ai_result?.actionItems?.length || 0;
  const entityCount = doc.ai_result?.keyEntities?.length || 0;
  const formattedDate = new Date(doc.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="group rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-brand-500/5 flex flex-col justify-between">
      <div>
        
        {/* Category & Date Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${getCategoryBadge(doc.category)}`}>
            <Tag className="h-3 w-3" />
            <span className="truncate max-w-[180px]">{doc.category}</span>
          </span>

          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Title */}
        <Link 
          to={`/documents/${doc.id}`}
          className="block group/title"
        >
          <h4 className="text-lg font-bold text-white group-hover/title:text-brand-400 transition-colors line-clamp-1 mb-2">
            {doc.title}
          </h4>
        </Link>

        {/* Executive TL;DR Snippet */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {doc.ai_result?.tldr || doc.ai_result?.summary || 'No summary preview available.'}
        </p>

        {/* Extracted Stats Row */}
        <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs mb-4">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Words</span>
            <span className="font-semibold text-slate-300">{(doc.word_count || 0).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Entities</span>
            <span className="font-semibold text-brand-400 flex items-center gap-1">
              <Layers className="h-3 w-3" />
              {entityCount}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Actions</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <CheckSquare className="h-3 w-3" />
              {actionItemCount}
            </span>
          </div>
        </div>

      </div>

      {/* Card Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
        <span className="text-[11px] font-medium text-slate-500">
          Tone: <span className="text-slate-400">{doc.output_tone}</span>
        </span>

        <div className="flex items-center gap-2">
          {onDelete && (
            <button
              onClick={() => onDelete(doc.id)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete Document"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}

          <Link
            to={`/documents/${doc.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600/20 text-brand-300 border border-brand-500/30 hover:bg-brand-600 hover:text-white transition-all"
          >
            <span>View Analysis</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

    </div>
  );
}
