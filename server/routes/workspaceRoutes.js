import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { createWorkspaceSchema } from '../schemas/documentSchemas.js';
import { documentService } from '../services/documentService.js';

const router = express.Router();

// All workspace routes require authentication
router.use(requireAuth);

/**
 * GET /api/workspaces
 * List all workspaces for authenticated user
 */
router.get('/', async (req, res, next) => {
  try {
    const workspaces = await documentService.getWorkspaces(req.user.id);
    res.json({
      success: true,
      data: workspaces
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/workspaces
 * Create a new workspace
 */
router.post('/', validateBody(createWorkspaceSchema), async (req, res, next) => {
  try {
    const newWorkspace = await documentService.createWorkspace(req.user.id, req.validatedBody);
    res.status(201).json({
      success: true,
      message: 'Workspace created successfully.',
      data: newWorkspace
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/workspaces/:id
 * Delete workspace and cascaded folders/documents
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await documentService.deleteWorkspace(req.user.id, id);
    res.json({
      success: true,
      message: 'Workspace deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
});

export default router;
