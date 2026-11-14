import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import StructuredReportView from '../components/StructuredReportView';
import WorkspaceModal from '../components/WorkspaceModal';
import FolderModal from '../components/FolderModal';
import { 
  Sparkles, 
  FileText, 
  Layers, 
  Folder, 
  PlusCircle, 
  FolderPlus, 
  Sliders, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Cpu, 
  ExternalLink 
} from 'lucide-react';

const CATEGORIES = [
  'Academic & Lecture Notes',
  'Research Paper & Technical Article',
  'Legal & Contract Document',
  'Business & Meeting Transcript',
  'Financial & Invoice Record',
  'General Document'
];

const EXTRACTION_DEPTHS = ['Concise', 'Standard', 'Comprehensive'];
const OUTPUT_TONES = ['Executive & Crisp', 'Academic & Detailed', 'Beginner-Friendly'];

// Realistic sample documents for instant 1-click testing
const SAMPLE_DOCUMENTS = {
  'Academic & Lecture Notes': {
    title: 'CS 289: Quantum Superposition, Entanglement, and Shor’s Factorization',
    tone: 'Academic & Detailed',
    depth: 'Standard',
    content: `Lecture 14: Foundations of Quantum Information and Shor's Algorithm

1. Principle of Quantum Superposition
A classical bit exists strictly in state |0> or |1>. A quantum bit (qubit) exists in a linear combination of basis states: |psi> = alpha|0> + beta|1>, where alpha and beta are complex probability amplitudes satisfying the normalization constraint |alpha|^2 + |beta|^2 = 1. Applying a Hadamard gate H to state |0> transforms the qubit into an equal superposition: (|0> + |1>)/sqrt(2).

2. Multi-Qubit Entanglement & Bell States
When multiple qubits interact, their joint quantum state cannot always be decomposed into tensor products of individual states. The canonical Bell state |Phi+> = (|00> + |11>)/sqrt(2) exhibits maximally entangled behavior. Measuring the first qubit instantaneously collapses the second qubit's state regardless of spatial separation, violating classical local hidden-variable realism as proven by Bell's theorem.

3. Quantum Circuit Architectures & Coherence Thresholds
Physical quantum hardware—such as superconducting transmon qubits and trapped-ion systems—faces severe decoherence caused by thermal phonons and electromagnetic drift. The T1 relaxation time (energy loss) and T2 dephasing time define the operational coherence envelope. Quantum Error Correction (QEC) protocols, specifically Surface Codes, require physical gate error rates below the 1% fault-tolerance threshold to synthesize one fault-tolerant logical qubit from approximately 1,000 physical qubits.

4. Shor’s Factorization Algorithm
Peter Shor (1994) demonstrated that finding the prime factors of an integer N can be solved in polynomial time O((log N)^3) on a quantum computer, breaking standard RSA-2048 public-key cryptography. The algorithm translates factorization into period-finding of the function f(x) = a^x mod N using the Quantum Fourier Transform (QFT). Classical post-processing employs continued fractions to deduce the period r from the quantum measurement.

5. Key Takeaways & Exam Directives:
- Understand matrix representations of Pauli gates (X, Y, Z), Hadamard (H), and CNOT.
- Memorize the mathematical derivation of Bell State measurement collapse.
- Contrast classical brute-force General Number Field Sieve O(exp((64/9)^(1/3) * (ln N)^(1/3) * (ln ln N)^(2/3))) with Shor's polynomial scaling.`
  },
  'Research Paper & Technical Article': {
    title: 'DocuTransformer: Scalable Multi-Modal Document Extraction with Adaptive Attention',
    tone: 'Academic & Detailed',
    depth: 'Comprehensive',
    content: `Abstract & Methodology Overview:
Extracting structured information from semi-structured PDF documents and high-resolution document scans has historically relied on fragmented OCR pipelines combined with fragile heuristic regex parsers. We introduce DocuTransformer, an end-to-end multi-modal vision-language architecture that unifies 2D spatial coordinates, visual layout bounding boxes, and lexical token embeddings into a single cross-attention encoder.

Key Architectural Findings:
1. Spatial-Aware Self-Attention (SASA): Standard Transformers treat textual sequences as 1-dimensional sequences, discarding positional typography. SASA injects normalized bounding box coordinates (x0, y0, x1, y1) directly into the relative positional bias matrix. Across benchmarks on the FUNSD and CORD document datasets, SASA improved entity extraction F1 score from 78.4% to 92.1% while reducing inference latency by 34%.

2. Pre-training Objective: We trained DocuTransformer on 14 million public documents using Masked Visual-Language Modeling (MVLM) and Text-Image Alignment (TIA). The model learns to reconstruct occluded tokens while predicting spatial alignment grids.

3. Benchmark Limitations & Edge Cases: While DocuTransformer achieves state-of-the-art results on English and Latin scripts, tabular documents with merged cells and low-contrast watermark backgrounds showed an 8.2% drop in token precision. Furthermore, documents exceeding 4,096 tokens require sparse chunking to fit within GPU VRAM constraints.

4. Production Deployment Guidelines:
- Hardware requirement: NVIDIA TensorRT runtime on A10G or L4 GPU for sub-120ms inference per page.
- Quantization: Int8 weight quantization preserves 99.4% of FP16 accuracy while halving memory footprint.
- Fallback Heuristic: When confidence scores fall below 0.85, the pipeline must route the page to human-in-the-loop review.`
  },
  'Legal & Contract Document': {
    title: 'Master Cloud SaaS Agreement — Data Privacy, SLA Commitments & Liability Terms',
    tone: 'Executive & Crisp',
    depth: 'Standard',
    content: `MASTER SERVICES AGREEMENT (MSA) — CLOUD ENTERPRISE EDITION

Effective Date: January 15, 2026
Between: CloudScale Systems Inc. ("Vendor") and Apex Global Enterprises ("Client").

Section 4: Service Level Agreements (SLA) & Uptime Guarantees
4.1 Uptime Commitment: Vendor warrants 99.95% Monthly Uptime Percentage for all Production Environments, excluding scheduled maintenance windows announced at least 72 hours in advance.
4.2 Service Credits: If uptime drops below 99.95% in any calendar month, Client is entitled to the following credits against future subscription invoices:
  - 99.0% to 99.94%: 10% monthly fee credit
  - 95.0% to 98.99%: 25% monthly fee credit
  - Below 95.0%: 50% monthly fee credit and immediate right to terminate without penalty.

Section 8: Confidentiality, GDPR & Data Security
8.1 Data Ownership: Client retains 100% exclusive ownership, title, and intellectual property rights in all Client Data uploaded or processed.
8.2 Security Protocols: Vendor shall maintain SOC 2 Type II certification, encrypt all data at rest using AES-256 and in transit using TLS 1.3, and conduct third-party penetration testing at least annually.
8.3 Breach Notification: In the event of a confirmed or suspected security incident affecting Client Data, Vendor must notify Client in writing within twenty-four (24) hours of discovery.

Section 11: Limitation of Liability & Indemnification
11.1 Aggregate Cap: Except for gross negligence, willful misconduct, or breaches of Section 8 (Data Security), each party's total aggregate liability arising out of or related to this Agreement shall be limited to the total fees paid by Client during the preceding twelve (12) month period.
11.2 Intellectual Property Indemnity: Vendor agrees to defend, indemnify, and hold harmless Client against any third-party claims alleging that the Software infringes any patent, copyright, or trademark.

Section 14: Termination & Transition Services
Upon expiration or termination, Vendor shall provide Client with full export of all Client Data in JSON/CSV format within fourteen (14) calendar days, followed by certified permanent cryptographic erasure.`
  },
  'Business & Meeting Transcript': {
    title: 'Q3 Enterprise Product Strategy & Go-To-Market Executive Sync',
    tone: 'Executive & Crisp',
    depth: 'Concise',
    content: `Meeting Date: November 10, 2026
Participants: Sarah Lin (Chief Product Officer), Marcus Vance (VP of Engineering), Elena Gomez (Head of Customer Success), David Chen (VP Sales).

Executive Discussion & Decisions Made:
1. Product Roadmap Acceleration: Sarah proposed pulling forward the Intelligent Document Processing (IDP) release to Q1 2027 to capitalize on enterprise demand for AI-automated document review. Marcus confirmed engineering can meet this deadline provided two additional senior backend engineers are allocated from the platform team.
Decision: Approved. Engineering to reallocate resources immediately.

2. Enterprise Security Compliance: Elena highlighted that three Fortune 500 prospects in our sales pipeline are requesting FedRAMP in-process status before signing contracts exceeding $250k ARR.
Decision: David Chen to coordinate with InfoSec team to commence FedRAMP Moderate readiness assessment by December 1st. Budget capped at $85,000.

3. Customer Retention & Churn Analysis: Q3 customer retention settled at 94.2% net dollar retention (NDR), falling short of our 110% target. The root cause identified was slow customer onboarding times (averaging 38 days).
Decision: Customer Success to launch an automated self-serve onboarding portal by January 15th to compress onboarding cycle to under 10 days.

Action Items & Owners:
- Marcus Vance: Finalize staffing reallocation and update sprint backlog by Friday, 5 PM.
- David Chen & Elena Gomez: Schedule joint discovery session with compliance auditor by next Tuesday.
- Sarah Lin: Prepare board deck summarizing accelerated IDP rollout before Monday's executive sync.`
  },
  'Financial & Invoice Record': {
    title: 'Q4 Fiscal Capital Expenditure, Cloud Infrastructure & Variance Report',
    tone: 'Executive & Crisp',
    depth: 'Standard',
    content: `CONSOLIDATED FINANCIAL REVIEW — FISCAL Q4
Reporting Entity: FinTech Dynamics Global LLC
Currency: USD

1. Executive Summary & Revenue Overview:
Total gross revenue for Q4 reached $18,450,000, representing a 14.2% year-over-year increase. Net operating income was $4,220,000, yielding a 22.8% operating margin. However, cloud infrastructure expenditures exceeded quarterly budget forecasts by $385,000 (18.6% variance), driven by increased AI model inference workloads and unoptimized vector database storage.

2. Line Item Expense Breakdown:
- AWS Compute (EC2 & EKS Clusters): $1,120,000 (Budgeted: $950,000)
- Google Cloud AI & Gemini API Invocations: $540,000 (Budgeted: $420,000)
- Enterprise PostgreSQL Hosting (Supabase & RDS): $185,000 (Budgeted: $160,000)
- Third-Party SaaS & Telemetry (Datadog, Snowflake): $610,000 (Budgeted: $540,000)
- Total Cloud Operations Expense: $2,455,000

3. Anomaly & Risk Analysis:
The primary financial anomaly was caused by redundant multi-region read replicas deployed in the European cluster that were left idle after the GDPR migration completed in October. These idle instances incurred an estimated $78,000 in unnecessary billing.

4. Corrective Fiscal Action Plan:
- Implement automated AWS/GCP instance scheduling to spin down non-production staging environments during off-peak hours (estimated monthly savings: $32,000).
- Decommission idle European database replicas by November 25th (immediate $26,000 quarterly reduction).
- Transition on-demand GPU inference instances to 1-year reserved instances to lock in 42% cost savings.`
  },
  'General Document': {
    title: 'High-Altitude Wind & Deep Ocean Renewable Energy Infrastructure',
    tone: 'Beginner-Friendly',
    depth: 'Standard',
    content: `Comprehensive Overview of Next-Generation Offshore Renewable Energy

1. Introduction to Marine Renewable Technologies
While traditional terrestrial solar and wind farms have expanded rapidly over the past decade, geographical constraints and grid bottlenecks are driving clean energy innovators to harness untapped offshore resources. Deep ocean wind turbines, ocean thermal energy conversion (OTEC), and tidal stream generators represent the frontier of continuous baseload clean power.

2. Floating Offshore Wind Platforms
Unlike fixed-bottom wind turbines that are restricted to shallow coastal waters (under 60 meters depth), floating offshore platforms utilize tension-leg platforms and semi-submersible hulls anchored to the seabed with synthetic mooring lines. These systems unlock the outer continental shelf, where wind velocities are significantly faster, more consistent, and uninterrupted by topographic obstacles.

3. High-Voltage Direct Current (HVDC) Transmission
Transporting gigawatts of electrical power over hundreds of nautical miles to onshore urban centers requires High-Voltage Direct Current (HVDC) transmission lines. Classical alternating current (AC) lines suffer immense capacitive power losses over long subsea distances. Subsea HVDC cables operate with under 3% power loss per 1,000 kilometers, making distant ocean energy hubs economically viable.

4. Environmental Considerations & Marine Ecological Impacts
Key environmental evaluations focus on acoustic emissions during anchoring, the creation of artificial reef ecosystems around mooring bases, and potential electromagnetic field influences on migratory pelagic fish. Regulatory permits require multi-year environmental impact assessments (EIAs) before seabed leases are granted.

5. Key Takeaways & Actionable Steps:
- Floating wind systems represent over 80% of global offshore wind potential.
- HVDC converter stations are the critical engineering bottleneck for transmission.
- Multi-stakeholder coordination across maritime regulators, naval forces, and fishing authorities is essential.`
  }
};

export default function ProcessStudioPage() {
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [workspaceId, setWorkspaceId] = useState('');
  const [folderId, setFolderId] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [extractionDepth, setExtractionDepth] = useState('Standard');
  const [outputTone, setOutputTone] = useState('Executive & Crisp');
  const [rawContent, setRawContent] = useState('');

  // Auxiliary data states
  const [workspaces, setWorkspaces] = useState([]);
  const [folders, setFolders] = useState([]);

  // Process status states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedResult, setProcessedResult] = useState(null);
  const [error, setError] = useState('');

  // Modals
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);

  // Load workspaces and folders on mount
  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        const wsList = await api.getWorkspaces();
        setWorkspaces(wsList || []);

        if (wsList && wsList.length > 0) {
          const defaultWs = wsList[0].id;
          setWorkspaceId(defaultWs);
          
          const fList = await api.getFolders(defaultWs);
          setFolders(fList || []);
          if (fList && fList.length > 0) {
            setFolderId(fList[0].id);
          }
        }
      } catch (err) {
        console.error('[ProcessStudio] Hierarchy load error:', err);
      }
    };

    fetchHierarchy();
  }, []);

  // When workspace changes, update folders
  const handleWorkspaceChange = async (newWsId) => {
    setWorkspaceId(newWsId);
    try {
      const fList = await api.getFolders(newWsId);
      setFolders(fList || []);
      if (fList && fList.length > 0) {
        setFolderId(fList[0].id);
      } else {
        setFolderId('');
      }
    } catch (err) {
      console.error('Error fetching folders for workspace:', err);
    }
  };

  // Quick Load Sample Document
  const handleLoadSample = (sampleCategory = category) => {
    const sample = SAMPLE_DOCUMENTS[sampleCategory] || SAMPLE_DOCUMENTS['Academic & Lecture Notes'];
    setTitle(sample.title);
    setCategory(sampleCategory);
    setOutputTone(sample.tone);
    setExtractionDepth(sample.depth);
    setRawContent(sample.content);
    setError('');
  };

  // Submit Processing Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || title.length < 3) {
      setError('Document title must be at least 3 characters long.');
      return;
    }

    if (!workspaceId) {
      setError('Please select or create a Workspace.');
      return;
    }

    if (!folderId) {
      setError('Please select or create a Folder within the selected Workspace.');
      return;
    }

    if (!rawContent.trim() || rawContent.length < 50) {
      setError('Document content must be at least 50 characters long.');
      return;
    }

    if (rawContent.length > 25000) {
      setError('Document content exceeds the 25,000 character maximum limit.');
      return;
    }

    try {
      setIsProcessing(true);
      setProcessedResult(null);

      const response = await api.processDocument({
        title: title.trim(),
        workspace_id: workspaceId,
        folder_id: folderId,
        category,
        extraction_depth: extractionDepth,
        output_tone: outputTone,
        raw_content: rawContent.trim()
      });

      if (response?.data) {
        setProcessedResult(response.data);
      } else {
        throw new Error('Received unexpected response structure from processing server.');
      }
    } catch (err) {
      console.error('[ProcessStudio] Processing error:', err);
      setError(err.message || 'Failed to process document with Gemini AI.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Live word / character counter
  const wordCount = rawContent.trim() ? rawContent.trim().split(/\s+/).length : 0;
  const charCount = rawContent.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Sparkles className="h-3 w-3" />
              Core AI Engine
            </span>
            <span className="text-xs text-slate-500 font-mono">gemini-2.5-flash</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Document Processing Studio
          </h1>
          <p className="text-sm text-slate-400">
            Configure extraction parameters, input raw text, and extract structured intelligence.
          </p>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
            Quick 1-Click Test:
          </span>
          <button
            type="button"
            onClick={() => handleLoadSample(category)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-brand-300 border border-brand-500/30 hover:border-brand-500/50 shadow-sm transition-all"
            title="Populate form with realistic domain sample text"
          >
            <BookOpen className="h-3.5 w-3.5 text-brand-400" />
            <span>Load Sample ({category.split('&')[0].trim()})</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs sm:text-sm text-rose-300 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Split-Screen Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT PANEL: Document Configuration & Input Form (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md shadow-xl space-y-6">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-brand-400" />
              Document Parameters
            </h3>
            <span className="text-xs text-slate-500">Max 25,000 Chars</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Document Title <span className="text-brand-400">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={150}
                placeholder="e.g. Stanford AI Lecture 14 or Cloud SaaS MSA Agreement"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Workspace & Folder Hierarchical Dropdowns */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Workspace <span className="text-brand-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setWorkspaceModalOpen(true)}
                    className="text-[11px] text-brand-400 hover:text-brand-300 font-semibold"
                  >
                    + New
                  </button>
                </div>
                <select
                  value={workspaceId}
                  onChange={(e) => handleWorkspaceChange(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 truncate"
                >
                  {workspaces.filter(ws => ws && ws.id).map((ws) => (
                    <option key={ws.id} value={ws.id}>
                      {ws.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Folder <span className="text-brand-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setFolderModalOpen(true)}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    + New
                  </button>
                </div>
                <select
                  value={folderId}
                  onChange={(e) => setFolderId(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 truncate"
                >
                  {folders.filter(f => f && f.id).map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                  {folders.length === 0 && (
                    <option value="">No folders (create one)</option>
                  )}
                </select>
              </div>
            </div>

            {/* Document Category Dropdown */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Target Domain Category <span className="text-brand-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  // Offer to load relevant sample if rawContent is empty
                  if (!rawContent) {
                    handleLoadSample(e.target.value);
                  }
                }}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Extraction Depth & Output Tone */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Extraction Depth
                </label>
                <div className="grid grid-cols-3 p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                  {EXTRACTION_DEPTHS.map((depth) => (
                    <button
                      key={depth}
                      type="button"
                      onClick={() => setExtractionDepth(depth)}
                      className={`py-1.5 font-semibold rounded-md transition-all ${
                        extractionDepth === depth
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {depth}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Output Tone
                </label>
                <select
                  value={outputTone}
                  onChange={(e) => setOutputTone(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  {OUTPUT_TONES.map((tone) => (
                    <option key={tone} value={tone}>
                      {tone}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Raw Document Textarea */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Raw Document Content <span className="text-brand-400">*</span>
                </label>
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span>{wordCount} words</span>
                  <span>{charCount} / 25,000 chars</span>
                </div>
              </div>

              <textarea
                rows={9}
                required
                maxLength={25000}
                placeholder="Paste your dense lecture notes, contract clauses, research methodology, meeting transcripts, or financial data here (minimum 50 characters)..."
                value={rawContent}
                onChange={(e) => setRawContent(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono leading-relaxed resize-y"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing || !rawContent.trim() || rawContent.length < 50}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-xl shadow-brand-500/25 disabled:opacity-50 transition-all hover:scale-[1.01]"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isProcessing ? 'Analyzing Document with Gemini...' : 'Analyze & Extract Intelligence'}</span>
            </button>

          </form>

        </div>

        {/* RIGHT PANEL: Live Intelligence Dashboard or Skeleton (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {isProcessing ? (
            <LoadingSkeleton />
          ) : processedResult ? (
            <div className="space-y-4">
              
              {/* Notification Banner with Link to Full Detail Page */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-emerald-300">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold block">Document Intelligence Extracted & Persisted!</span>
                    <span className="text-emerald-400/80">Saved to PostgreSQL table with Row Level Security.</span>
                  </div>
                </div>

                <Link
                  to={`/documents/${processedResult.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-500 text-white shrink-0 transition-all"
                >
                  <span>Open Full Report Page</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>

              {/* Rendered Structured Report */}
              <StructuredReportView
                report={processedResult.ai_result}
                documentTitle={processedResult.title}
                category={processedResult.category}
                wordCount={processedResult.word_count}
                createdAt={processedResult.created_at}
              />

            </div>
          ) : (
            
            /* Idle Placeholder State */
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-10 text-center space-y-6">
              <div className="h-16 w-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto">
                <Cpu className="h-8 w-8" />
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-xl font-bold text-white">
                  Document Intelligence Output Studio
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Fill in the configuration panel on the left or click 
                  <strong className="text-brand-300"> "Load Sample" </strong> 
                  to populate realistic domain notes. Once you submit, Gemini 2.5 Flash will automatically extract:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left text-xs text-slate-300">
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-brand-400" />
                  <span>Executive Summary & TL;DR</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-purple-400" />
                  <span>Key Entities & Definitions</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Prioritized Action Items</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-rose-400" />
                  <span>Risk Flags & Mitigation Gaps</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 sm:col-span-2 flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-amber-400" />
                  <span>Active Recall Self-Test Questions with Answers</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleLoadSample('Academic & Lecture Notes')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Load Sample Academic Notes & Try Now</span>
                </button>
              </div>

            </div>

          )}

        </div>

      </div>

      {/* Auxiliary Hierarchy Modals */}
      <WorkspaceModal
        isOpen={workspaceModalOpen}
        onClose={() => setWorkspaceModalOpen(false)}
        onCreated={async (newWs) => {
          const ws = await api.createWorkspace(newWs);
          if (ws && ws.id) {
            setWorkspaces(prev => [ws, ...(prev || []).filter(w => w && w.id && w.id !== ws.id)]);
            setWorkspaceId(ws.id);
            const fList = await api.getFolders(ws.id);
            setFolders(fList || []);
            if (fList && fList.length > 0) setFolderId(fList[0].id);
          } else {
            const refreshed = await api.getWorkspaces();
            if (Array.isArray(refreshed)) {
              const valid = refreshed.filter(w => w && w.id);
              setWorkspaces(valid);
              if (valid.length > 0) setWorkspaceId(valid[0].id);
            }
          }
        }}
      />

      <FolderModal
        isOpen={folderModalOpen}
        onClose={() => setFolderModalOpen(false)}
        workspaces={workspaces.filter(w => w && w.id)}
        defaultWorkspaceId={workspaceId}
        onCreated={async (newFolder) => {
          const f = await api.createFolder(newFolder);
          if (f && f.id) {
            setFolders(prev => [f, ...(prev || []).filter(folder => folder && folder.id && folder.id !== f.id)]);
            setFolderId(f.id);
          } else {
            const refreshed = await api.getFolders(newFolder.workspace_id);
            if (Array.isArray(refreshed)) {
              setFolders(refreshed.filter(folder => folder && folder.id));
            }
          }
        }}
      />

    </div>
  );
}
