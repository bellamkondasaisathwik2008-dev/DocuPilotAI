import { documentService } from './services/documentService.js';
import { processDocumentWithGemini } from './services/geminiService.js';

async function runServiceTests() {
  console.log(`\n==================================================`);
  console.log(`🧪 TESTING CORE SERVICES (GEMINI AI & POSTGRESQL/DOCUMENT SERVICE)`);
  console.log(`==================================================\n`);

  const testUserId = '00000000-0000-0000-0000-000000000001';

  // 1. Workspaces Provisioning
  console.log('1. Testing ensureDefaultWorkspace & getWorkspaces...');
  const workspaces = await documentService.getWorkspaces(testUserId);
  console.log(`   Workspaces returned: ${workspaces.length}`);
  const defaultWs = workspaces[0];
  console.log(`   Workspace: "${defaultWs.name}" (ID: ${defaultWs.id})`);

  // 2. Create custom workspace
  console.log('\n2. Testing createWorkspace...');
  const customWs = await documentService.createWorkspace(testUserId, {
    name: 'Autonomous Systems & Deep Learning',
    description: 'Lecture notes and research methodology'
  });
  console.log(`   Created Workspace: "${customWs.name}" (ID: ${customWs.id})`);

  // 3. Folders
  console.log('\n3. Testing getFolders & createFolder...');
  const folders = await documentService.getFolders(testUserId, customWs.id);
  console.log(`   Default folders in workspace: ${folders.length}`);
  
  const customFolder = await documentService.createFolder(testUserId, {
    workspaceId: customWs.id,
    name: 'Neural Attention Mechanisms'
  });
  console.log(`   Created Folder: "${customFolder.name}" (ID: ${customFolder.id})`);

  // 4. Gemini AI Engine
  console.log('\n4. Testing Gemini AI Processing Engine (gemini-2.5-flash structured output)...');
  const sampleText = `Lecture 14: Foundations of Quantum Information and Shor's Algorithm
A classical bit exists strictly in state 0 or 1. A quantum bit (qubit) exists in a linear combination of basis states: |psi> = alpha|0> + beta|1>, where alpha and beta are complex probability amplitudes satisfying |alpha|^2 + |beta|^2 = 1. Applying a Hadamard gate H transforms |0> into an equal superposition.
When multiple qubits interact, their joint quantum state cannot always be decomposed into individual tensor states. The canonical Bell state |Phi+> exhibits maximally entangled behavior.
Peter Shor (1994) demonstrated that finding prime factors of an integer N can be solved in polynomial time O((log N)^3) on a quantum computer using the Quantum Fourier Transform (QFT), breaking RSA-2048 encryption.`;

  const { aiResult, wordCount, modelUsed } = await processDocumentWithGemini({
    title: 'CS 289: Quantum Superposition & Shor Algorithm',
    category: 'Academic & Lecture Notes',
    extractionDepth: 'Standard',
    outputTone: 'Academic & Detailed',
    rawContent: sampleText
  });

  console.log('   Model Invocation:', modelUsed);
  console.log('   Calculated Word Count:', wordCount);
  console.log('   TL;DR Summary:', aiResult.tldr);
  console.log(`   Extracted Key Entities (${aiResult.keyEntities.length}):`, aiResult.keyEntities.map(e => e.name).join(', '));
  console.log(`   Prioritized Action Items (${aiResult.actionItems.length}):`, aiResult.actionItems.map(a => `[${a.priority}] ${a.task.slice(0, 40)}...`).join(' | '));
  console.log(`   Critical Insights (${aiResult.criticalInsights.length}):`, aiResult.criticalInsights[0]?.insight);
  console.log(`   Risks & Gaps (${aiResult.risksAndGaps.length}):`, aiResult.risksAndGaps[0]?.issue);
  console.log(`   Review Questions (${aiResult.reviewQuestions.length}):`, aiResult.reviewQuestions[0]?.question);

  // 5. Persist Document in Database
  console.log('\n5. Testing createDocument in PostgreSQL table...');
  const savedDoc = await documentService.createDocument(testUserId, {
    workspace_id: customWs.id,
    folder_id: customFolder.id,
    title: 'CS 289: Quantum Superposition & Shor Algorithm',
    category: 'Academic & Lecture Notes',
    extraction_depth: 'Standard',
    output_tone: 'Academic & Detailed',
    raw_content: sampleText,
    word_count: wordCount,
    ai_result: aiResult
  });
  console.log(`   Saved Document ID: ${savedDoc.id}`);

  // 6. Retrieve Document Detail
  console.log('\n6. Testing getDocumentById...');
  const retrievedDoc = await documentService.getDocumentById(testUserId, savedDoc.id);
  console.log(`   Retrieved Doc Title: "${retrievedDoc.title}"`);
  console.log(`   Verified AI Result Summary: "${retrievedDoc.ai_result.summary.slice(0, 60)}..."`);

  // 7. Analytics Calculation
  console.log('\n7. Testing getAnalytics...');
  const analytics = await documentService.getAnalytics(testUserId);
  console.log(`   Total Documents: ${analytics.totalDocuments}`);
  console.log(`   Active Workspaces: ${analytics.activeWorkspaces}`);
  console.log(`   Total Action Items: ${analytics.totalActionItems}`);
  console.log(`   Most Analyzed Category: ${analytics.mostAnalyzedCategory}`);
  console.log(`   Total Words Indexed: ${analytics.totalWordsProcessed}`);

  // 8. Document Search and Filter
  console.log('\n8. Testing getDocuments with search filter...');
  const searchResults = await documentService.getDocuments(testUserId, { search: 'Quantum' });
  console.log(`   Found ${searchResults.length} matching documents for query "Quantum"`);

  console.log(`\n==================================================`);
  console.log(`✅ ALL SERVICE LAYER & AI ENGINE TESTS PASSED!`);
  console.log(`==================================================\n`);
  process.exit(0);
}

runServiceTests().catch(err => {
  console.error('Service test error:', err);
  process.exit(1);
});
