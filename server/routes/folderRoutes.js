import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { createFolderSchema } from '../schemas/documentSchemas.js';
import { documentService } from '../services/documentService.js';

const router = express.Router();

// All folder routes require authentication
router.use(requireAuth);

/**
 * GET /api/folders
 * List folders for authenticated user, optionally filtered by workspace_id
 */
router.get('/', async (req, res, next) => {
  try {
    const { workspace_id } = req.query;
    const folders = await documentService.getFolders(req.user.id, workspace_id);
    res.json({
      success: true,
      data: folders
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/folders
 * Create a new folder under a workspace
 */
router.post('/', validateBody(createFolderSchema), async (req, res, next) => {
  try {
    const { workspace_id, name } = req.validatedBody;
    const newFolder = await documentService.createFolder(req.user.id, {
      workspaceId: workspace_id,
      name
    });
    res.status(201).json({
      success: true,
      message: 'Folder created successfully.',
      data: newFolder
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/folders/:id
 * Delete folder and its documents
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await documentService.deleteFolder(req.user.id, id);
    res.json({
      success: true,
      message: 'Folder deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
});

export default router;
