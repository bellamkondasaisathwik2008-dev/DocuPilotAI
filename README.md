# DocuPilot AI — Intelligent Document Processing & Knowledge Extraction Platform

[![Google Gen AI SDK](https://img.shields.io/badge/Google%20Gen%20AI-@google/genai-4285F4?logo=google&logoColor=white)](https://aistudio.google.com)
[![Model](https://img.shields.io/badge/Model-Gemini%202.5%20Flash-8B5CF6)](https://deepmind.google/technologies/gemini/)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL%20(RLS)-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20+%20Vite%20+%20Tailwind-61DAFB?logo=react&logoColor=black)](https://vitejs.dev)
[![Validation](https://img.shields.io/badge/Validation-Zod%20Schema-3E67B1?logo=zod&logoColor=white)](https://zod.dev)

DocuPilot AI is a full-stack Intelligent Document Processing (IDP) and knowledge extraction web platform. It enables students, researchers, legal professionals, and executives to organize documents into **Workspaces** and **Folders**, submit dense text (lecture notes, contracts, research papers, earnings calls) with customizable extraction parameters, and instantly receive machine-validated structured intelligence persisted in PostgreSQL.

---

## 🌟 Key Capabilities

1. **Official Gemini 2.5 Flash Structured Engine**:
   - Strictly enforced JSON output schemas via the official Google Gen AI SDK (`@google/genai`).
   - Configurable **Extraction Depth** (`Concise` | `Standard` | `Comprehensive`) and **Output Tone** (`Executive & Crisp` | `Academic & Detailed` | `Beginner-Friendly`).
   - 1-click sample document loader with real domain text for instant hackathon evaluation.

2. **Five-Pillar Machine-Validated Intelligence Dashboard**:
   - **Executive Summary & TL;DR**: Crisp high-level takeaway followed by an articulate overview.
   - **Extracted Key Entities & Definitions**: Terms, metrics, stakeholders, or clauses with direct sentence excerpts and filter chips.
   - **Prioritized Action Items**: Verb-led obligations with `High`, `Medium`, or `Low` priority badges, assignees, and target phases.
   - **Critical Strategic Insights & Risk Flags**: Highlights key takeaways, ambiguities, and recommended mitigation remedies.
   - **Active Recall Self-Test Questions**: Multi-difficulty review questions with click-to-expand answers for exam prep and knowledge retention.

3. **Workspace & Folder Hierarchy with PostgreSQL RLS**:
   - Organize documents into nested Workspaces (e.g., *"Stanford CS289"*, *"Client NDAs"*) and Folders (e.g., *"Quantum Cryptography"*, *"Vendor SLAs"*).
   - All tables enforce Row Level Security (RLS) guaranteeing user data isolation.

4. **Searchable Knowledge Repository & Markdown Export**:
   - Full-text search and category filtering across all indexed documents.
   - Revisit any past analysis without re-running AI.
   - 1-click **"Copy as Markdown"** generates clean GitHub-Flavored Markdown for Obsidian, Notion, or GitHub.

5. **Executive Analytics Overview**:
   - Live KPI cards: Total Documents Processed, Active Workspaces, Total Action Items Extracted, and Most Analyzed Document Category.

---

## 🏗️ Architecture & Monorepo Structure

```
Intelligent document processing/
├── client/                              # Frontend React + Vite + Tailwind CSS Application
│   ├── src/
│   │   ├── components/                  # Navbar, Footer, LoadingSkeleton, StatCard,
│   │   │                                # DocumentCard, WorkspaceModal, FolderModal,
│   │   │                                # StructuredReportView
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # Supabase Auth state & persistent session management
│   │   ├── lib/
│   │   │   ├── api.js                   # Authenticated API client (attaches Bearer JWT)
│   │   │   └── supabase.js              # Supabase browser client with instant demo auth
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx          # Feature overview, workflow, and CTA
│   │   │   ├── AuthPage.jsx             # Tabbed Sign In / Sign Up with 1-click demo login
│   │   │   ├── DashboardPage.jsx        # Command center, KPI metrics, workspace sidebar, document feed
│   │   │   ├── ProcessStudioPage.jsx    # Split-screen studio (input form & live AI report)
│   │   │   └── DocumentDetailPage.jsx   # Collapsible raw text, metadata, structured report, markdown export
│   │   ├── App.jsx                      # Client router and route protections
│   │   ├── index.css                    # Tailwind directives and radiant styling
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js                   # Reverse proxy configuration to Express backend
│   └── tailwind.config.js
│
├── server/                              # Node.js + Express API Backend
│   ├── config/
│   │   ├── env.js                       # Environment variable loader
│   │   └── supabase.js                  # Supabase Admin client & in-memory fallback adapter
│   ├── middleware/
│   │   ├── auth.js                      # Bearer JWT verification via supabase.auth.getUser()
│   │   ├── errorHandler.js              # Centralized API error handler
│   │   └── validate.js                  # Request body validator powered by Zod
│   ├── routes/
│   │   ├── authRoutes.js                # Profile & public health check endpoints
│   │   ├── workspaceRoutes.js           # Workspace CRUD operations
│   │   ├── folderRoutes.js              # Folder CRUD operations
│   │   ├── documentRoutes.js            # Document processing & search endpoints
│   │   └── analyticsRoutes.js           # KPI analytics summary endpoint
│   ├── schemas/
│   │   └── documentSchemas.js           # Zod validation schemas for requests & Gemini JSON
│   ├── services/
│   │   ├── geminiService.js             # Official @google/genai integration (gemini-2.5-flash)
│   │   └── documentService.js           # PostgreSQL persistence & cascade handler
│   ├── index.js                         # Server entrypoint with Helmet, CORS, and rate limiting
│   ├── test-services.js                 # Verification test suite for database and AI services
│   └── package.json
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql       # PostgreSQL schema with UUIDs, foreign keys, indexes, and RLS
│
└── package.json                         # Monorepo task runner scripts
```

---

## 🎯 Target Domains Supported

The system provides tailored extraction guidance for 6 document domains:

| Category | Domain Focus & Custom Extraction Guidelines |
| :--- | :--- |
| **`Academic & Lecture Notes`** | Core concepts, formal theoretical definitions, formulas, study takeaways, and active recall exam review questions. |
| **`Research Paper & Technical Article`** | Methodology, empirical findings, architectural trade-offs, theoretical claims, citations, limitations, and future work. |
| **`Legal & Contract Document`** | Obligations, critical deadlines, defined legal terms, indemnities, liability caps, and compliance risk flags. |
| **`Business & Meeting Transcript`** | Key decisions made, owners/assignees, blockers, upcoming milestones, stakeholder alignments, and next steps. |
| **`Financial & Invoice Record`** | Monetary amounts, line items, dates, vendor obligations, variances, financial ratios, fiscal risks, and anomalies. |
| **`General Document`** | Balanced summary, central themes, key entities, next steps, risks, and review questions. |

---

## 💾 Database Schema (PostgreSQL)

Located at `supabase/migrations/001_initial_schema.sql`:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workspaces
CREATE TABLE public.workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 100),
    description TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Folders
CREATE TABLE public.folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Documents
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    folder_id UUID NOT NULL REFERENCES public.folders(id) ON DELETE CASCADE,
    title TEXT NOT NULL CHECK (char_length(title) >= 1 AND char_length(title) <= 200),
    category TEXT NOT NULL,
    extraction_depth TEXT NOT NULL DEFAULT 'Standard',
    output_tone TEXT NOT NULL DEFAULT 'Executive & Crisp',
    raw_content TEXT NOT NULL,
    word_count INTEGER NOT NULL DEFAULT 0,
    ai_result JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security (RLS) is enabled on all tables
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ (Node v20.18.0 is included in `.node/`)
- A **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/app/apikey))
- Optional: A **Supabase Cloud Project** (from [supabase.com](https://supabase.com))

### 2. Configure Environment Variables

**Backend (`server/.env`):**
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Credentials (optional for local demo mode)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Frontend (`client/.env`):**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_API_BASE_URL=
```

> **Zero-Friction Hackathon Mode:** If Supabase credentials or Gemini API keys are omitted, DocuPilot AI automatically switches to a high-fidelity local in-memory PostgreSQL emulator and intelligent local analyzer, allowing instant 1-click testing with zero friction!

### 3. Run the Verification Test Suite
```bash
npm test
```

### 4. Start the Application
Open two terminal windows:

**Terminal 1 (Backend Express API Server):**
```bash
npm run server
# Live on http://localhost:5000
```

**Terminal 2 (Frontend React Client):**
```bash
npm run client
# Live on http://localhost:5173
```

---

## 📡 API Endpoint Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/auth/health` | Health check & model status | No |
| `GET` | `/api/auth/me` | Authenticated user profile | Yes (Bearer JWT) |
| `GET` | `/api/workspaces` | List user workspaces | Yes (Bearer JWT) |
| `POST` | `/api/workspaces` | Create a new workspace | Yes (Bearer JWT) |
| `DELETE` | `/api/workspaces/:id` | Delete workspace and cascade | Yes (Bearer JWT) |
| `GET` | `/api/folders` | List folders (supports `?workspace_id=`) | Yes (Bearer JWT) |
| `POST` | `/api/folders` | Create a new folder | Yes (Bearer JWT) |
| `DELETE` | `/api/folders/:id` | Delete a folder | Yes (Bearer JWT) |
| `POST` | `/api/documents/process` | Analyze text with Gemini 2.5 Flash & save | Yes (Bearer JWT) |
| `GET` | `/api/documents` | List documents (supports category & search) | Yes (Bearer JWT) |
| `GET` | `/api/documents/:id` | Retrieve single document report | Yes (Bearer JWT) |
| `DELETE` | `/api/documents/:id` | Delete a document report | Yes (Bearer JWT) |
| `GET` | `/api/analytics` | Retrieve KPI metrics for dashboard | Yes (Bearer JWT) |

---

## 🛡️ Security & Reliability

- **Helmet**: Secures HTTP response headers against clickjacking, XSS, and MIME-sniffing.
- **Express Rate Limit**: Mitigates brute-force attacks and API abuse with sliding window limits.
- **Zod Schema Validation**: Strict input sanitization on all endpoints with detailed error messages.
- **Row Level Security**: Database policies isolate records so users can only ever access their own workspaces, folders, and documents.
