import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { documentService } from '../services/documentService.js';

const router = express.Router();

router.use(requireAuth);

/**
 * GET /api/analytics
 * Retrieve KPI summary statistics for the dashboard
 */
router.get('/', async (req, res, next) => {
  try {
    const stats = await documentService.getAnalytics(req.user.id);
    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    next(err);
  }
});

export default router;
