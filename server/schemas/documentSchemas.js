import { z } from 'zod';

export const DOCUMENT_CATEGORIES = [
  'Academic & Lecture Notes',
  'Research Paper & Technical Article',
  'Legal & Contract Document',
  'Business & Meeting Transcript',
  'Financial & Invoice Record',
  'General Document'
];

export const EXTRACTION_DEPTHS = ['Concise', 'Standard', 'Comprehensive'];
export const OUTPUT_TONES = ['Executive & Crisp', 'Academic & Detailed', 'Beginner-Friendly'];

// Validation schema for incoming document processing request
export const processDocumentSchema = z.object({
  title: z
    .string({ required_error: 'Document title is required' })
    .trim()
    .min(3, 'Title must be at least 3 characters long')
    .max(150, 'Title cannot exceed 150 characters'),
  workspace_id: z
    .string({ required_error: 'Workspace is required' })
    .min(1, 'Please select a valid workspace'),
  folder_id: z
    .string({ required_error: 'Folder is required' })
    .min(1, 'Please select a valid folder'),
  category: z.enum(DOCUMENT_CATEGORIES, {
    errorMap: () => ({ message: 'Please select a valid document category' })
  }),
  extraction_depth: z.enum(EXTRACTION_DEPTHS, {
    errorMap: () => ({ message: 'Extraction depth must be Concise, Standard, or Comprehensive' })
  }).default('Standard'),
  output_tone: z.enum(OUTPUT_TONES, {
    errorMap: () => ({ message: 'Output tone must be Executive & Crisp, Academic & Detailed, or Beginner-Friendly' })
  }).default('Executive & Crisp'),
  raw_content: z
    .string({ required_error: 'Document text content is required' })
    .trim()
    .min(50, 'Document content must be at least 50 characters long to extract meaningful intelligence')
    .max(25000, 'Document content exceeds the 25,000 character limit')
});

// Workspace creation schema
export const createWorkspaceSchema = z.object({
  name: z
    .string({ required_error: 'Workspace name is required' })
    .trim()
    .min(1, 'Workspace name cannot be empty')
    .max(100, 'Workspace name cannot exceed 100 characters'),
  description: z.string().max(300).optional().default('')
});

// Folder creation schema
export const createFolderSchema = z.object({
  workspace_id: z
    .string({ required_error: 'Workspace ID is required' })
    .min(1, 'Workspace ID is required'),
  name: z
    .string({ required_error: 'Folder name is required' })
    .trim()
    .min(1, 'Folder name cannot be empty')
    .max(100, 'Folder name cannot exceed 100 characters')
});

// Structured AI Output Schema (Gemini response validation)
export const aiResultSchema = z.object({
  summary: z.string().default('No summary available.'),
  tldr: z.string().default(''),
  keyEntities: z.array(
    z.object({
      name: z.string(),
      type: z.string().default('Concept'),
      definition: z.string(),
      context: z.string().optional().default('')
    })
  ).default([]),
  actionItems: z.array(
    z.object({
      task: z.string(),
      priority: z.enum(['High', 'Medium', 'Low']).default('Medium'),
      assigneeOrRole: z.string().default('Unassigned'),
      suggestedDeadlineOrPhase: z.string().default('Immediate / Review')
    })
  ).default([]),
  criticalInsights: z.array(
    z.object({
      insight: z.string(),
      impact: z.string().default('Informational'),
      category: z.string().default('General')
    })
  ).default([]),
  risksAndGaps: z.array(
    z.object({
      issue: z.string(),
      severity: z.enum(['High', 'Medium', 'Low']).default('Medium'),
      mitigation: z.string().default('Further analysis recommended.')
    })
  ).default([]),
  reviewQuestions: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
      explanation: z.string().default(''),
      difficulty: z.enum(['Easy', 'Medium', 'Hard']).default('Medium')
    })
  ).default([])
});
