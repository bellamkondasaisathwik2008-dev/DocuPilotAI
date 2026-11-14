import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import StructuredReportView from '../components/StructuredReportView';
import { 
  FileText, 
  ArrowLeft, 
  Calendar, 
  Tag, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Loader2, 
  AlertCircle, 
  Sparkles, 
  Layers 
} from 'lucide-react';

export default function DocumentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRawText, setShowRawText] = useState(false);
  const [rawCopied, setRawCopied] = useState(false);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        setLoading(true);
        setError('');
        const doc = await api.getDocumentById(id);
        if (!doc) {
          setError('Document report not found.');
        } else {
          setDocument(doc);
        }
      } catch (err) {
        console.error('[DocumentDetail] Load error:', err);
        setError(err.message || 'Failed to retrieve document report.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete "${document.title}"?`)) {
      return;
    }
    try {
      await api.deleteDocument(id);
      navigate('/dashboard');
    } catch (err) {
      alert(err.message || 'Failed to delete document.');
    }
  };

  const handleCopyRaw = () => {
    if (document?.raw_content) {
      navigator.clipboard.writeText(document.raw_content);
      setRawCopied(true);
      setTimeout(() => setRawCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 text-brand-400 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">
          Loading document intelligence report from PostgreSQL...
        </p>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 inline-block">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Document Not Found</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          {error || 'The requested document does not exist or has been removed.'}
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-500"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(document.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Navigation Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link to="/dashboard" className="hover:text-slate-300">Dashboard</Link>
              <span>/</span>
              <span className="text-slate-400">Document Report</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-0.5">
              {document.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
            title="Delete this document report"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete Document</span>
          </button>
        </div>
      </div>

      {/* Metadata Badges Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
          <Tag className="h-3.5 w-3.5" />
          <span>{document.category}</span>
        </span>

        <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-medium">
          Depth: <strong className="text-white">{document.extraction_depth}</strong>
        </span>

        <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-medium">
          Tone: <strong className="text-white">{document.output_tone}</strong>
        </span>

        <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-medium">
          Word Count: <strong className="text-white">{(document.word_count || 0).toLocaleString()}</strong>
        </span>

        <span className="flex items-center gap-1.5 text-slate-400 ml-auto">
          <Calendar className="h-3.5 w-3.5 text-slate-500" />
          <span>{formattedDate}</span>
        </span>
      </div>

      {/* Collapsible Original Raw Document Text */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowRawText(!showRawText)}
          className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-slate-900/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-brand-400" />
            <span>Original Raw Document Content ({document.raw_content?.length || 0} characters)</span>
          </div>
          {showRawText ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showRawText && (
          <div className="p-5 border-t border-slate-800 bg-slate-950/80 space-y-3">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleCopyRaw}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              >
                {rawCopied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{rawCopied ? 'Copied' : 'Copy Raw Text'}</span>
              </button>
            </div>
            <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed max-h-80 overflow-y-auto p-4 rounded-lg bg-slate-900 border border-slate-800/80">
              {document.raw_content}
            </pre>
          </div>
        )}
      </div>

      {/* Structured AI Intelligence Report Dashboard */}
      <StructuredReportView
        report={document.ai_result}
        documentTitle={document.title}
        category={document.category}
        wordCount={document.word_count}
        createdAt={document.created_at}
      />

    </div>
  );
}
