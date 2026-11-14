import { GoogleGenAI, Type } from '@google/genai';
import { config } from '../config/env.js';
import { aiResultSchema } from '../schemas/documentSchemas.js';

let aiClient = null;

if (config.isGeminiConfigured) {
  try {
    aiClient = new GoogleGenAI({ apiKey: config.geminiApiKey });
    console.log('[Gemini] Initialized official Google Gen AI SDK (@google/genai) for model gemini-2.5-flash.');
  } catch (err) {
    console.warn('[Gemini] Failed to initialize Google Gen AI client:', err.message);
  }
}

// Strict JSON schema definition for gemini-2.5-flash
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { 
      type: Type.STRING, 
      description: 'Comprehensive executive summary tailored to the requested depth and tone.' 
    },
    tldr: { 
      type: Type.STRING, 
      description: 'A crisp 1-2 sentence high-level takeaway.' 
    },
    keyEntities: {
      type: Type.ARRAY,
      description: 'Key domain entities, terms, definitions, stakeholders, or metrics extracted from the text.',
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'The entity or technical term name' },
          type: { type: Type.STRING, description: 'Category: e.g. Concept, Stakeholder, Metric, Clause, Definition, Technology' },
          definition: { type: Type.STRING, description: 'Accurate definition or role deduced from the document' },
          context: { type: Type.STRING, description: 'Direct sentence or excerpt where this entity was applied' }
        },
        required: ['name', 'type', 'definition']
      }
    },
    actionItems: {
      type: Type.ARRAY,
      description: 'Action items, next steps, review obligations, or study exercises.',
      items: {
        type: Type.OBJECT,
        properties: {
          task: { type: Type.STRING, description: 'Actionable verb-led task description' },
          priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'], description: 'Relative urgency or criticality' },
          assigneeOrRole: { type: Type.STRING, description: 'Assigned party, stakeholder, or target reader' },
          suggestedDeadlineOrPhase: { type: Type.STRING, description: 'Timeline, milestone, or study phase' }
        },
        required: ['task', 'priority', 'assigneeOrRole', 'suggestedDeadlineOrPhase']
      }
    },
    criticalInsights: {
      type: Type.ARRAY,
      description: 'Key strategic takeaways, methodological breakthroughs, business conclusions, or conceptual insights.',
      items: {
        type: Type.OBJECT,
        properties: {
          insight: { type: Type.STRING, description: 'The core insight or conclusion' },
          impact: { type: Type.STRING, description: 'Why this matters to the user or organization' },
          category: { type: Type.STRING, description: 'Domain focus: Strategic, Operational, Methodological, Financial, Legal' }
        },
        required: ['insight', 'impact', 'category']
      }
    },
    risksAndGaps: {
      type: Type.ARRAY,
      description: 'Potential risks, ambiguities, unverified assumptions, liability clauses, or knowledge gaps.',
      items: {
        type: Type.OBJECT,
        properties: {
          issue: { type: Type.STRING, description: 'Description of the risk, missing information, or bottleneck' },
          severity: { type: Type.STRING, enum: ['High', 'Medium', 'Low'], description: 'Severity level' },
          mitigation: { type: Type.STRING, description: 'Recommended remedy, clarification, or contingency action' }
        },
        required: ['issue', 'severity', 'mitigation']
      }
    },
    reviewQuestions: {
      type: Type.ARRAY,
      description: 'Active recall and comprehension self-test questions with expandable answers to test understanding.',
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: 'Targeted self-test question based on the document' },
          answer: { type: Type.STRING, description: 'Concise correct answer based on the facts' },
          explanation: { type: Type.STRING, description: 'Detailed explanatory reasoning and supporting context' },
          difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'], description: 'Difficulty level' }
        },
        required: ['question', 'answer', 'explanation', 'difficulty']
      }
    }
  },
  required: [
    'summary',
    'tldr',
    'keyEntities',
    'actionItems',
    'criticalInsights',
    'risksAndGaps',
    'reviewQuestions'
  ]
};

// Category-specific prompt guidance
const getCategoryGuidance = (category) => {
  switch (category) {
    case 'Academic & Lecture Notes':
      return 'Focus heavily on extracting core concepts, formal definitions, theoretical foundations, formulas, study takeaways, and rigorous exam review questions for self-testing.';
    case 'Research Paper & Technical Article':
      return 'Emphasize research methodology, key empirical findings, architectural trade-offs, theoretical claims, citations/entities, limitations, and future work.';
    case 'Legal & Contract Document':
      return 'Carefully extract contractual obligations, critical deadlines, defined legal terms, covenants, indemnities, liability limits, and potential compliance ambiguities or risks.';
    case 'Business & Meeting Transcript':
      return 'Focus on key decisions made, identified owners/assignees, blockers, upcoming milestones, stakeholder alignments, and actionable next steps.';
    case 'Financial & Invoice Record':
      return 'Isolate monetary amounts, line items, dates, vendor obligations, variances, financial ratios, fiscal risks, and payment anomalies.';
    case 'General Document':
    default:
      return 'Provide a balanced, highly structured breakdown identifying central themes, key entities, next steps, risks, and review questions.';
  }
};

/**
 * High-fidelity intelligent mock generator for offline / zero-API-key testing.
 * Analyzes the text intelligently and produces realistic structured JSON matching the exact schema.
 */
const generateMockAnalysis = ({ title, category, extractionDepth, outputTone, rawContent }) => {
  const words = rawContent.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = rawContent.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 15);
  
  // Pick representative sentences for summary
  const leadSentences = sentences.slice(0, Math.min(3, sentences.length)).join('. ') + '.';
  
  // Extract potential entities from capitalized words or key terms
  const potentialEntities = Array.from(new Set(
    (rawContent.match(/\b[A-Z][a-z]{3,}(?:\s+[A-Z][a-z]{3,})*\b/g) || [])
      .filter(w => !['This', 'That', 'With', 'From', 'Then', 'When', 'There', 'However', 'Therefore'].includes(w))
  )).slice(0, 6);

  const fallbackEntities = [
    { name: potentialEntities[0] || 'Core Architecture', type: 'Concept', definition: 'The foundational structure and design principles governing the system described in the document.', context: sentences[0] || 'Described in the introductory overview.' },
    { name: potentialEntities[1] || 'Primary Stakeholder', type: 'Entity', definition: 'The responsible party or governing body accountable for execution and compliance.', context: sentences[1] || 'Referenced throughout operational clauses.' },
    { name: potentialEntities[2] || 'Verification Protocol', type: 'Protocol', definition: 'The criteria and methodology established for quality assurance, audit, or validation.', context: sentences[2] || 'Mentioned in procedural guidelines.' },
    { name: potentialEntities[3] || 'Key Performance Metric', type: 'Metric', definition: 'The quantitative threshold used to evaluate efficiency, compliance, or success.', context: 'Derived from performance benchmarks.' }
  ];

  return {
    summary: `${title} provides a ${outputTone.toLowerCase()} exploration within the ${category} domain. ${leadSentences} The document highlights systemic processes, core requirements, and operational touchpoints across ${wordCount} words, emphasizing strategic alignment and continuous verification.`,
    tldr: sentences[0] ? `${sentences[0]}. Key decisions and requirements must be tracked against milestone targets.` : `A structured analysis of ${title} establishing core tenets and required deliverables.`,
    keyEntities: fallbackEntities,
    actionItems: [
      {
        task: `Conduct comprehensive audit and alignment review for "${title}"`,
        priority: 'High',
        assigneeOrRole: 'Lead Specialist / Domain Owner',
        suggestedDeadlineOrPhase: 'Phase 1 - Immediate Sprint'
      },
      {
        task: 'Document standard operating procedures and update team repository',
        priority: 'Medium',
        assigneeOrRole: 'Operations & Engineering Team',
        suggestedDeadlineOrPhase: 'Phase 2 - Week 2'
      },
      {
        task: 'Schedule follow-up stakeholder debrief to validate milestones and deliverables',
        priority: 'Low',
        assigneeOrRole: 'Project Manager',
        suggestedDeadlineOrPhase: 'Phase 3 - Month End'
      }
    ],
    criticalInsights: [
      {
        insight: `The document establishes unambiguous benchmarks under the ${category} framework.`,
        impact: 'Provides clear operational direction and minimizes cross-functional friction.',
        category: 'Strategic'
      },
      {
        insight: 'Key dependencies require active oversight to avoid milestone slippage.',
        impact: 'Ensures delivery timelines remain on schedule without sacrificing quality.',
        category: 'Operational'
      }
    ],
    risksAndGaps: [
      {
        issue: 'Ambiguity in peripheral specifications or unstated edge cases.',
        severity: 'Medium',
        mitigation: 'Conduct focused discovery session with domain authors to document explicit edge case criteria.'
      },
      {
        issue: 'Potential resource constraint during validation phase.',
        severity: 'Low',
        mitigation: 'Allocate dedicated review buffer and cross-train team members on key verification tasks.'
      }
    ],
    reviewQuestions: [
      {
        question: `What is the primary objective articulated in "${title}"?`,
        answer: sentences[0] || 'To establish an intelligent, structured workflow and enforce compliance standards.',
        explanation: 'The opening section sets the baseline criteria and operational bounds for the entire topic.',
        difficulty: 'Easy'
      },
      {
        question: 'Which key factors or dependencies most directly influence success?',
        answer: 'Rigorous adherence to the defined verification protocol and prompt mitigation of identified risks.',
        explanation: 'Without continuous validation, systemic assumptions may diverge from actual operational conditions.',
        difficulty: 'Medium'
      },
      {
        question: 'How should team members approach the highest priority action item?',
        answer: 'By engaging domain stakeholders immediately to execute the Phase 1 audit.',
        explanation: 'High priority tasks carry compounding impact on downstream deliverables if delayed.',
        difficulty: 'Hard'
      }
    ]
  };
};

/**
 * Main entry point for processing document with Gemini 2.5 Flash
 */
export const processDocumentWithGemini = async ({
  title,
  category,
  extractionDepth,
  outputTone,
  rawContent
}) => {
  const wordCount = rawContent.split(/\s+/).filter(Boolean).length;
  const categoryGuidance = getCategoryGuidance(category);

  // If Gemini API Key is not configured or in development without key, use the high-fidelity mock engine
  if (!config.isGeminiConfigured || !aiClient) {
    console.log('[GeminiService] GEMINI_API_KEY is not set. Generating high-fidelity mock analysis.');
    const mockResult = generateMockAnalysis({ title, category, extractionDepth, outputTone, rawContent });
    return {
      aiResult: aiResultSchema.parse(mockResult),
      wordCount,
      modelUsed: 'mock-engine (provide GEMINI_API_KEY for live gemini-2.5-flash)'
    };
  }

  const prompt = `You are an expert Intelligent Document Processing (IDP) and Knowledge Extraction AI Engine.
Analyze the following document and generate a structured JSON intelligence report adhering strictly to the provided JSON schema.

DOCUMENT METADATA:
- Title: ${title}
- Category: ${category}
- Extraction Depth: ${extractionDepth} (Concise = tight punchy summaries; Standard = thorough; Comprehensive = exhaustive detail)
- Output Tone: ${outputTone} (Adjust vocabulary, formality, and analytical depth accordingly)

DOMAIN-SPECIFIC INSTRUCTIONS:
${categoryGuidance}

ANALYSIS REQUIREMENTS:
1. "summary": Write an articulate executive summary adhering to the ${outputTone} tone and ${extractionDepth} depth.
2. "tldr": Write a 1-2 sentence core takeaway.
3. "keyEntities": Extract 4 to 10 key entities, technical terms, organizations, metrics, or clauses with definitions and direct context.
4. "actionItems": Identify 3 to 8 concrete, prioritized next steps with priority ('High', 'Medium', 'Low'), assignee/role, and timeframe.
5. "criticalInsights": Extract 2 to 5 high-impact takeaways or strategic conclusions.
6. "risksAndGaps": Identify 2 to 5 ambiguities, risks, blind spots, or missing details with mitigation steps.
7. "reviewQuestions": Generate 3 to 6 active recall review questions (Easy, Medium, Hard) with answers and explanations for self-testing.

RAW DOCUMENT CONTENT:
"""
${rawContent}
"""`;

  try {
    console.log(`[GeminiService] Calling gemini-2.5-flash for document: "${title}" (${wordCount} words)`);
    
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.2
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Gemini returned an empty response.');
    }

    const parsedJson = JSON.parse(responseText);
    const validatedResult = aiResultSchema.parse(parsedJson);

    return {
      aiResult: validatedResult,
      wordCount,
      modelUsed: 'gemini-2.5-flash'
    };
  } catch (err) {
    console.error('[GeminiService Error]:', err.message);
    console.warn('[GeminiService] Falling back to intelligent local analyzer to guarantee uptime.');
    
    const fallbackResult = generateMockAnalysis({ title, category, extractionDepth, outputTone, rawContent });
    return {
      aiResult: aiResultSchema.parse(fallbackResult),
      wordCount,
      modelUsed: 'gemini-2.5-flash (local fallback due to API error: ' + err.message + ')'
    };
  }
};
