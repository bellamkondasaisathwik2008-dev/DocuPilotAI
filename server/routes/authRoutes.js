import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { config } from '../config/env.js';

const router = express.Router();

/**
 * GET /api/auth/me
 * Returns current authenticated user
 */
router.get('/me', requireAuth, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      metadata: req.user.user_metadata || {},
      created_at: req.user.created_at
    }
  });
});

/**
 * GET /api/auth/health
 * Public server health and configuration check
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      gemini: {
        configured: config.isGeminiConfigured,
        model: 'gemini-2.5-flash',
        sdk: '@google/genai'
      },
      supabase: {
        configured: config.isSupabaseConfigured,
        mode: config.isSupabaseConfigured ? 'cloud-postgresql' : 'in-memory-adapter'
      }
    }
  });
});

export default router;
