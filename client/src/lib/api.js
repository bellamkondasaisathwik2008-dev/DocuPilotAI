import { supabase } from './supabase.js';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Generic authenticated fetch wrapper
 */
async function request(endpoint, options = {}) {
  // Retrieve token from Supabase session
  let token = null;
  try {
    const { data } = await supabase.auth.getSession();
    token = data?.session?.access_token;
  } catch (err) {
    console.warn('[API] Could not retrieve session token:', err);
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.error || data.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.details = data.details;
    throw error;
  }

  return data;
}

export const api = {
  // Health
  checkHealth: () => request('/api/auth/health'),

  // Workspaces
  getWorkspaces: () => request('/api/workspaces').then(res => res.data),
  createWorkspace: (body) => request('/api/workspaces', {
    method: 'POST',
    body: JSON.stringify(body)
  }).then(res => res.data),
  deleteWorkspace: (id) => request(`/api/workspaces/${id}`, { method: 'DELETE' }),

  // Folders
  getFolders: (workspaceId = null) => {
    const query = workspaceId ? `?workspace_id=${encodeURIComponent(workspaceId)}` : '';
    return request(`/api/folders${query}`).then(res => res.data);
  },
  createFolder: (body) => request('/api/folders', {
    method: 'POST',
    body: JSON.stringify(body)
  }).then(res => res.data),
  deleteFolder: (id) => request(`/api/folders/${id}`, { method: 'DELETE' }),

  // Documents
  processDocument: (payload) => request('/api/documents/process', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getDocuments: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.workspace_id) searchParams.append('workspace_id', params.workspace_id);
    if (params.folder_id) searchParams.append('folder_id', params.folder_id);
    if (params.category) searchParams.append('category', params.category);
    if (params.search) searchParams.append('search', params.search);

    const qs = searchParams.toString();
    return request(`/api/documents${qs ? `?${qs}` : ''}`).then(res => res.data);
  },
  getDocumentById: (id) => request(`/api/documents/${id}`).then(res => res.data),
  deleteDocument: (id) => request(`/api/documents/${id}`, { method: 'DELETE' }),

  // Analytics
  getAnalytics: () => request('/api/analytics').then(res => res.data)
};
