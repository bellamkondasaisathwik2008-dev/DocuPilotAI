import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { processDocumentSchema } from '../schemas/documentSchemas.js';
import { processDocumentWithGemini } from '../services/geminiService.js';
import { documentService } from '../services/documentService.js';

const router = express.Router();

// All document routes require authentication
router.use(requireAuth);

/**
 * POST /api/documents/process
 * Core AI processing endpoint: Invokes gemini-2.5-flash with strict JSON schema,
 * persists the raw text and extracted structured analysis in PostgreSQL, and returns result.
 */
router.post('/process', validateBody(processDocumentSchema), async (req, res, next) => {
  try {
    const {
      title,
      workspace_id,
      folder_id,
      category,
      extraction_depth,
      output_tone,
      raw_content
    } = req.validatedBody;

    // 1. Run Gemini AI extraction
    const { aiResult, wordCount, modelUsed } = await processDocumentWithGemini({
      title,
      category,
      extractionDepth: extraction_depth,
      outputTone: output_tone,
      rawContent: raw_content
    });

    // 2. Persist in database
    const savedDocument = await documentService.createDocument(req.user.id, {
      workspace_id,
      folder_id,
      title,
      category,
      extraction_depth,
      output_tone,
      raw_content,
      word_count: wordCount,
      ai_result: aiResult
    });

    res.status(201).json({
      success: true,
      message: 'Document successfully analyzed and saved.',
      modelUsed,
      data: savedDocument
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/documents
 * List documents with workspace, folder, category, and keyword filters
 */
router.get('/', async (req, res, next) => {
  try {
    const { workspace_id, folder_id, category, search } = req.query;
    const documents = await documentService.getDocuments(req.user.id, {
      workspaceId: workspace_id,
      folderId: folder_id,
      category,
      search
    });

    res.json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/documents/:id
 * Retrieve a single saved document report by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const document = await documentService.getDocumentById(req.user.id, id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document report not found or you do not have permission to access it.'
      });
    }

    res.json({
      success: true,
      data: document
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/documents/:id
 * Delete a processed document record
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await documentService.deleteDocument(req.user.id, id);

    res.json({
      success: true,
      message: 'Document report deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
});

export default router;
