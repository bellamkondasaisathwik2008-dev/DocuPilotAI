import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import DocumentCard from '../components/DocumentCard';
import WorkspaceModal from '../components/WorkspaceModal';
import FolderModal from '../components/FolderModal';
import { 
  FileText, 
  Layers, 
  CheckSquare, 
  Tag, 
  PlusCircle, 
  Search, 
  Folder, 
  FolderPlus, 
  Filter, 
  Trash2, 
  Sparkles, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';

const CATEGORIES = [
  'ALL',
  'Academic & Lecture Notes',
  'Research Paper & Technical Article',
  'Legal & Contract Document',
  'Business & Meeting Transcript',
  'Financial & Invoice Record',
  'General Document'
];

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Data states
  const [stats, setStats] = useState({
    totalDocuments: 0,
    activeWorkspaces: 0,
    totalActionItems: 0,
    mostAnalyzedCategory: 'None yet',
    totalWordsProcessed: 0
  });
  const [workspaces, setWorkspaces] = useState([]);
  const [folders, setFolders] = useState([]);
  const [documents, setDocuments] = useState([]);

  // Filter states
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState('ALL');
  const [selectedFolderId, setSelectedFolderId] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // UI modal states
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all initial data
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const [statsData, wsData] = await Promise.all([
        api.getAnalytics().catch(() => null),
        api.getWorkspaces().catch(() => [])
      ]);

      if (statsData) setStats(statsData);
      setWorkspaces(wsData || []);

      // If user has workspaces, load folders
      const foldersData = await api.getFolders().catch(() => []);
      setFolders(foldersData || []);

      // Load documents
      const docsData = await api.getDocuments().catch(() => []);
      setDocuments(docsData || []);

    } catch (err) {
      console.error('[Dashboard] Error loading dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Load documents when filters change
  const refreshDocuments = async () => {
    try {
      const docs = await api.getDocuments({
        workspace_id: selectedWorkspaceId !== 'ALL' ? selectedWorkspaceId : undefined,
        folder_id: selectedFolderId !== 'ALL' ? selectedFolderId : undefined,
        category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
        search: searchQuery || undefined
      });
      setDocuments(docs || []);
    } catch (err) {
      console.error('[Dashboard] Error fetching filtered documents:', err);
    }
  };

  useEffect(() => {
    if (!loading) {
      refreshDocuments();
    }
  }, [selectedWorkspaceId, selectedFolderId, selectedCategory, searchQuery]);

  // Handle Workspace creation
  const handleWorkspaceCreated = async (newWsData) => {
    try {
      const created = await api.createWorkspace(newWsData);
      if (created && created.id) {
        setWorkspaces(prev => [created, ...(prev || []).filter(ws => ws && ws.id && ws.id !== created.id)]);
        setSelectedWorkspaceId(created.id);
        setSelectedFolderId('ALL');
        const updatedFolders = await api.getFolders(created.id);
        setFolders(updatedFolders || []);
      } else {
        // Fallback: reload workspaces list from server
        const refreshed = await api.getWorkspaces();
        if (Array.isArray(refreshed)) {
          const valid = refreshed.filter(ws => ws && ws.id);
          setWorkspaces(valid);
          if (valid.length > 0) setSelectedWorkspaceId(valid[0].id);
        }
      }
      // Refresh stats
      api.getAnalytics().then(s => s && setStats(s)).catch(() => {});
    } catch (err) {
      console.error('Failed to create workspace:', err);
      throw err;
    }
  };

  // Handle Folder creation
  const handleFolderCreated = async (newFolderData) => {
    try {
      const created = await api.createFolder(newFolderData);
      if (created && created.id) {
        setFolders(prev => [created, ...(prev || []).filter(f => f && f.id && f.id !== created.id)]);
        setSelectedFolderId(created.id);
      } else {
        const refreshed = await api.getFolders(newFolderData.workspace_id);
        if (Array.isArray(refreshed)) {
          setFolders(refreshed.filter(f => f && f.id));
        }
      }
    } catch (err) {
      console.error('Failed to create folder:', err);
      throw err;
    }
  };

  // Handle Document deletion
  const handleDeleteDocument = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document intelligence report?')) {
      return;
    }
    try {
      await api.deleteDocument(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
      // Refresh stats
      api.getAnalytics().then(s => setStats(s)).catch(() => {});
    } catch (err) {
      alert(err.message || 'Failed to delete document.');
    }
  };

  // Filtered folders by selected workspace
  const activeFolders = (folders || []).filter(
    (f) => f && f.id && (selectedWorkspaceId === 'ALL' || f.workspace_id === selectedWorkspaceId)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Document Command Center
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Welcome back, <strong className="text-brand-300">{user?.user_metadata?.name || user?.email}</strong>. 
            Review extracted entities, action items, and process new documents.
          </p>
        </div>

        <Link
          to="/process"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20 transition-all hover:scale-105 shrink-0"
        >
          <Sparkles className="h-4 w-4" />
          <span>Process New Document</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-300 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Documents"
          value={stats.totalDocuments.toString()}
          subtitle={`${stats.totalWordsProcessed.toLocaleString()} words indexed`}
          icon={FileText}
          color="brand"
        />
        <StatCard
          title="Active Workspaces"
          value={stats.activeWorkspaces.toString()}
          subtitle="Organized hierarchical clusters"
          icon={Layers}
          color="cyan"
        />
        <StatCard
          title="Action Items Extracted"
          value={stats.totalActionItems.toString()}
          subtitle="Prioritized obligations & steps"
          icon={CheckSquare}
          color="emerald"
        />
        <StatCard
          title="Top Category"
          value={stats.mostAnalyzedCategory.split('&')[0].trim()}
          subtitle="Most analyzed document domain"
          icon={Tag}
          color="amber"
        />
      </div>

      {/* Main Content Layout: Sidebar + Document Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Column: Workspaces & Folders Navigation */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Workspaces Section */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-brand-400" />
                Workspaces
              </span>
              <button
                onClick={() => setWorkspaceModalOpen(true)}
                className="p-1 rounded text-slate-400 hover:text-brand-300 hover:bg-slate-800 transition-colors"
                title="Create Workspace"
              >
                <PlusCircle className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => {
                  setSelectedWorkspaceId('ALL');
                  setSelectedFolderId('ALL');
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                  selectedWorkspaceId === 'ALL'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>All Workspaces</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/40">
                  {stats.totalDocuments}
                </span>
              </button>

              {workspaces.filter(ws => ws && ws.id).map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    setSelectedWorkspaceId(ws.id);
                    setSelectedFolderId('ALL');
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between truncate ${
                    selectedWorkspaceId === ws.id
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className="truncate">{ws.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Folders Section */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Folder className="h-3.5 w-3.5 text-indigo-400" />
                Folders
              </span>
              <button
                onClick={() => setFolderModalOpen(true)}
                disabled={workspaces.length === 0}
                className="p-1 rounded text-slate-400 hover:text-indigo-300 hover:bg-slate-800 disabled:opacity-40 transition-colors"
                title="Create Folder"
              >
                <FolderPlus className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => setSelectedFolderId('ALL')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                  selectedFolderId === 'ALL'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>All Folders</span>
              </button>

              {activeFolders.filter(f => f && f.id).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFolderId(f.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between truncate ${
                    selectedFolderId === f.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className="truncate">{f.name}</span>
                </button>
              ))}

              {activeFolders.length === 0 && (
                <p className="text-[11px] text-slate-500 py-2 text-center">
                  No folders in this workspace.
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Search, Filter & Document Cards */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Search & Category Filter Bar */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search processed documents by keyword, title, or TL;DR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Category Dropdown Filter */}
            <div className="w-full sm:w-auto shrink-0 flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400 shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-56 py-2 px-3 rounded-lg border border-slate-700 bg-slate-950 text-xs text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Document Feed Header */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
            <span>
              Showing {documents.length} {documents.length === 1 ? 'document' : 'documents'}
            </span>
            {(selectedWorkspaceId !== 'ALL' || selectedFolderId !== 'ALL' || selectedCategory !== 'ALL' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedWorkspaceId('ALL');
                  setSelectedFolderId('ALL');
                  setSelectedCategory('ALL');
                  setSearchQuery('');
                }}
                className="text-brand-400 hover:text-brand-300 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Loading or Document Cards Grid */}
          {loading ? (
            <div className="p-12 text-center space-y-3">
              <Loader2 className="h-8 w-8 text-brand-400 animate-spin mx-auto" />
              <p className="text-sm text-slate-400 font-medium">Loading your document repository...</p>
            </div>
          ) : documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.filter(doc => doc && doc.id).map((doc) => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  onDelete={handleDeleteDocument}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 text-center space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">No documents found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                  {searchQuery || selectedCategory !== 'ALL'
                    ? 'No documents matched your search or category filters. Try resetting the filters.'
                    : 'Your workspace is ready. Submit your first raw text document to extract structured AI intelligence.'}
                </p>
              </div>
              <Link
                to="/process"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/20 transition-all hover:scale-105"
              >
                <Sparkles className="h-4 w-4" />
                <span>Process Document Now</span>
              </Link>
            </div>
          )}

        </div>

      </div>

      {/* Quick Modals */}
      <WorkspaceModal
        isOpen={workspaceModalOpen}
        onClose={() => setWorkspaceModalOpen(false)}
        onCreated={handleWorkspaceCreated}
      />

      <FolderModal
        isOpen={folderModalOpen}
        onClose={() => setFolderModalOpen(false)}
        workspaces={workspaces}
        defaultWorkspaceId={selectedWorkspaceId !== 'ALL' ? selectedWorkspaceId : (workspaces[0]?.id || '')}
        onCreated={handleFolderCreated}
      />

    </div>
  );
}
