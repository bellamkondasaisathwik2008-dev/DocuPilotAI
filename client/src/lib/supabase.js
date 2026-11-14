import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http') && 
  !supabaseUrl.includes('your-project')
);

// Fallback in-memory auth state for instant 1-click testing if Supabase is unconfigured
const mockStorageKey = 'docupilot_demo_session';

const getMockUser = () => {
  const stored = localStorage.getItem(mockStorageKey);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  }
  return null;
};

const mockAuth = {
  async getSession() {
    const user = getMockUser();
    if (!user) return { data: { session: null }, error: null };
    return {
      data: {
        session: {
          access_token: 'demo-token-' + user.id,
          user
        }
      },
      error: null
    };
  },
  async getUser() {
    const user = getMockUser();
    return { data: { user }, error: null };
  },
  async signInWithPassword({ email, password }) {
    if (!email || !password) {
      return { data: null, error: new Error('Email and password are required.') };
    }
    const mockUser = {
      id: 'demo-user-' + Math.random().toString(36).substring(2, 9),
      email,
      user_metadata: { name: email.split('@')[0] || 'Researcher' },
      created_at: new Date().toISOString()
    };
    localStorage.setItem(mockStorageKey, JSON.stringify(mockUser));
    return {
      data: {
        user: mockUser,
        session: { access_token: 'demo-token-' + mockUser.id, user: mockUser }
      },
      error: null
    };
  },
  async signUp({ email, password, options }) {
    if (!email || !password) {
      return { data: null, error: new Error('Email and password are required.') };
    }
    const mockUser = {
      id: 'demo-user-' + Math.random().toString(36).substring(2, 9),
      email,
      user_metadata: { name: options?.data?.name || email.split('@')[0] || 'Researcher' },
      created_at: new Date().toISOString()
    };
    localStorage.setItem(mockStorageKey, JSON.stringify(mockUser));
    return {
      data: {
        user: mockUser,
        session: { access_token: 'demo-token-' + mockUser.id, user: mockUser }
      },
      error: null
    };
  },
  async signOut() {
    localStorage.removeItem(mockStorageKey);
    return { error: null };
  },
  onAuthStateChange(callback) {
    // Return an unsubscribe function
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  }
};

let clientInstance = null;

if (isSupabaseConfigured) {
  try {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey);
    console.log('[Supabase Client] Connected to configured Supabase Cloud instance.');
  } catch (err) {
    console.warn('[Supabase Client] Failed to initialize, using local auth:', err);
    clientInstance = { auth: mockAuth };
  }
} else {
  console.log('[Supabase Client] Running in standalone demo mode with local mock auth.');
  clientInstance = { auth: mockAuth };
}

export const supabase = clientInstance;
