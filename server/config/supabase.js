import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';
import { randomUUID } from 'crypto';

// Polyfill global WebSocket for Node.js < 22 to prevent RealtimeClient warnings
if (!globalThis.WebSocket) {
  globalThis.WebSocket = class DummyWebSocket {};
}

let supabaseClient = null;

// Local in-memory database store for immediate zero-config testing / fallback
const memoryDb = {
  workspaces: [],
  folders: [],
  documents: []
};

// Seed initial default data for fallback testing if memory store is empty
const seedDefaultData = (userId) => {
  const existingWs = memoryDb.workspaces.find(w => w.user_id === userId);
  if (!existingWs) {
    const wsId = randomUUID();
    const folderId = randomUUID();
    const now = new Date().toISOString();
    
    memoryDb.workspaces.push({
      id: wsId,
      user_id: userId,
      name: 'General Workspace',
      description: 'Default workspace for incoming notes and documents',
      created_at: now
    });

    memoryDb.folders.push({
      id: folderId,
      workspace_id: wsId,
      user_id: userId,
      name: 'Inbox',
      created_at: now
    });
  }
};

// Lightweight Supabase query builder mock for offline/unconfigured environments
const createMemoryQueryBuilder = (table) => {
  let filters = [];
  let orderField = null;
  let orderAscending = true;

  const getFilteredData = () => {
    let result = [...(memoryDb[table] || [])];
    for (const filter of filters) {
      result = result.filter(filter);
    }
    if (orderField) {
      result.sort((a, b) => {
        if (a[orderField] < b[orderField]) return orderAscending ? -1 : 1;
        if (a[orderField] > b[orderField]) return orderAscending ? 1 : -1;
        return 0;
      });
    }
    return result;
  };

  const builder = {
    select: (fields = '*') => {
      return builder;
    },
    eq: (column, value) => {
      filters.push((item) => item[column] === value);
      return builder;
    },
    order: (column, { ascending = true } = {}) => {
      orderField = column;
      orderAscending = ascending;
      return builder;
    },
    insert: (values) => {
      const records = Array.isArray(values) ? values : [values];
      const inserted = records.map((record) => {
        const item = {
          id: record.id || randomUUID(),
          created_at: record.created_at || new Date().toISOString(),
          ...record
        };
        memoryDb[table].push(item);
        return item;
      });

      const insertResult = {
        data: Array.isArray(values) ? inserted : inserted[0],
        error: null,
        select: () => insertResult,
        single: async () => ({ data: inserted[0] || null, error: null }),
        then: (resolve) => resolve({ data: Array.isArray(values) ? inserted : inserted[0], error: null })
      };

      return insertResult;
    },
    delete: () => {
      return {
        eq: async (column, value) => {
          // Cascade deletion if deleting workspace or folder
          if (table === 'workspaces') {
            memoryDb.documents = memoryDb.documents.filter(d => d.workspace_id !== value);
            memoryDb.folders = memoryDb.folders.filter(f => f.workspace_id !== value);
          } else if (table === 'folders') {
            memoryDb.documents = memoryDb.documents.filter(d => d.folder_id !== value);
          }

          memoryDb[table] = memoryDb[table].filter(item => item[column] !== value);
          return { data: null, error: null };
        }
      };
    },
    single: async () => {
      const result = getFilteredData();
      return {
        data: result.length > 0 ? result[0] : null,
        error: null
      };
    },
    then: (resolve) => {
      const result = getFilteredData();
      resolve({ data: result, error: null });
    }
  };

  return builder;
};

// Fallback Supabase adapter when cloud Supabase is not configured
const fallbackSupabase = {
  auth: {
    getUser: async (token) => {
      if (!token) return { data: { user: null }, error: new Error('Token required') };
      const userId = token.startsWith('demo-') ? token : '00000000-0000-0000-0000-000000000001';
      seedDefaultData(userId);
      return {
        data: {
          user: {
            id: userId,
            email: 'demo-user@docupilot.ai',
            user_metadata: { name: 'Demo Researcher' }
          }
        },
        error: null
      };
    }
  },
  from: (table) => createMemoryQueryBuilder(table),
  isFallback: true
};

if (config.isSupabaseConfigured) {
  try {
    supabaseClient = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('[Supabase] Initialized Supabase Admin Client connected to Cloud PostgreSQL.');
  } catch (err) {
    console.warn('[Supabase] Failed to initialize cloud client, falling back to memory adapter:', err.message);
    supabaseClient = fallbackSupabase;
  }
} else {
  console.log('[Supabase] Supabase credentials not found in .env. Running with fast in-memory fallback adapter.');
  supabaseClient = fallbackSupabase;
}

export const supabase = supabaseClient;
export const getSupabase = () => supabaseClient;
export { memoryDb, seedDefaultData };
