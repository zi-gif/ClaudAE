import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  Search, ArrowRight, Building2, Users, DollarSign, Github, Briefcase, Globe,
  Zap, TrendingUp, ChevronRight, Target, MessageSquare, Layers, Shield,
  Sparkles, BookOpen, Code2, Cpu, ArrowUpRight, SlidersHorizontal, X, Check,
  AlertCircle, Lightbulb, FileText, Printer, Send, Edit3, Copy,
  Activity, AlertTriangle, Rocket, Clock, Mail, ChevronDown, ChevronUp,
  Phone, Calendar, BarChart3, Grid3X3, List, RefreshCw, Key, Eye, EyeOff,
  Star, TrendingDown, UserMinus, Bell, PlayCircle
} from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LineChart, Line, CartesianGrid,
  Area, AreaChart
} from "recharts";

/* ═══════════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS — Anthropic / Claude Design System
   ═══════════════════════════════════════════════════════════════════════════════ */

const C = {
  parchment: "#f5f4ed",
  ivory:     "#faf9f5",
  white:     "#ffffff",
  sand:      "#e8e6dc",
  nearBlack: "#141413",
  dark:      "#30302e",
  charcoal:  "#4d4c48",
  olive:     "#5e5d59",
  stone:     "#87867f",
  darkWarm:  "#3d3d3a",
  silver:    "#b0aea5",
  borderL:   "#f0eee6",
  borderM:   "#e8e6dc",
  ringW:     "#d1cfc5",
  terra:     "#c96442",
  coral:     "#d97757",
  healthGood:    "#6b8f5e",
  healthWatch:   "#c9a842",
  healthRisk:    "#c96442",
  healthCrit:    "#a13d2d",
};

const sans = "'Styrene A Web','Söhne',ui-sans-serif,system-ui,-apple-system,sans-serif";
const serif = "Georgia,'Palatino Linotype','Book Antiqua',serif";
const ring = (color = C.ringW) => `0 0 0 1px ${color}`;
const whisper = "0 4px 24px rgba(0,0,0,0.04)";

/* ═══════════════════════════════════════════════════════════════════════════════
   MOCK DATA — 15 Startup Accounts
   ═══════════════════════════════════════════════════════════════════════════════ */

const ACCOUNTS = [
  {
    id: 1, name: "Cursor", domain: "cursor.com", logo: "Cu", industry: "Dev Tools", segment: "Startup",
    employees: "50–100", funding: "Series B — $105M", hq: "San Francisco, CA",
    description: "AI-first code editor using LLMs for completions, generation, and codebase understanding.",
    health: 92, breakout: 95, tier: "star", acv: "$2M–5M", champion: "CEO / CTO",
    mrr: "$185K", mrrTrend: "+12%", apiCalls: "48M/mo",
    usageTrend: [62, 68, 75, 82, 95, 108, 125, 142, 158, 172, 180, 185],
    signals: {
      aiJobs: { score: 95, detail: "Entire company is AI-focused. Every engineer works on AI integration." },
      githubActivity: { score: 90, detail: "Active open-source presence. Deep integration with multiple LLM providers." },
      techStack: { score: 95, detail: "VS Code fork + custom AI middleware. Multi-model — provider quality directly impacts UX." },
      fundingMomentum: { score: 90, detail: "$105M Series B. Explosive growth — fastest-growing dev tool in 2024-25." },
      blogMentions: { score: 88, detail: "Constant discussion of model quality. Community compares Claude vs GPT in Cursor." },
      marketFit: { score: 98, detail: "Every keystroke triggers an API call. Massive token volume. Pure consumption play." }
    },
    competitiveIntel: { currentStack: "Multi-provider: Claude Sonnet, GPT-4, custom models", pain: "Latency — 200ms vs 400ms is the difference between magic and annoying.", switching: "Already using Claude — expand wallet share and become the default." },
    useCases: [
      { name: "Code Completions", potential: "Very High", consumption: "$200K–500K/mo", estimate: 350000, description: "Tab completions across millions of active developers." },
      { name: "Codebase Chat", potential: "Very High", consumption: "$100K–300K/mo", estimate: 200000, description: "Long-context codebase understanding and Q&A." },
      { name: "Multi-file Editing", potential: "High", consumption: "$50K–100K/mo", estimate: 75000, description: "Complex refactoring and multi-file generation." }
    ],
    outreachAngles: [
      { type: "Expansion", angle: "Cursor already uses Claude — expanding Claude's share of total API calls. Sonnet 4's speed + quality make it the natural default." },
      { type: "Strategic", angle: "Co-marketing opportunity: 'Built with Claude' positioning benefits both brands in the developer community." }
    ],
    briefing: { trigger: "expansion", reason: "API usage up 12% MoM — approaching next pricing tier. New Composer feature driving increased multi-file editing calls.", action: "Schedule pricing discussion for expanded tier. Share Sonnet 4 benchmark improvements." },
    engagement: { lastTouch: "3 days ago", touchType: "QBR", nextStep: "Send Sonnet 4 speed benchmarks", playbook: "upsell" }
  },
  {
    id: 2, name: "Vercel", domain: "vercel.com", logo: "V", industry: "Dev Tools", segment: "Growth",
    employees: "500–800", funding: "Series E — $250M", hq: "San Francisco, CA",
    description: "Frontend cloud platform. AI SDK and v0 code generation are core products.",
    health: 88, breakout: 91, tier: "star", acv: "$800K–1.5M", champion: "CTO / VP Product (v0)",
    mrr: "$72K", mrrTrend: "+18%", apiCalls: "12M/mo",
    usageTrend: [22, 25, 28, 32, 38, 42, 48, 52, 58, 62, 68, 72],
    signals: {
      aiJobs: { score: 88, detail: "8 AI roles open including 'AI SDK Engineer'. AI SDK is a core product." },
      githubActivity: { score: 95, detail: "AI SDK is open-source with 10K+ stars. Supports multiple LLM providers." },
      techStack: { score: 90, detail: "Next.js/React ecosystem. AI SDK provides unified LLM interface." },
      fundingMomentum: { score: 88, detail: "$250M Series E. AI features central to growth strategy." },
      blogMentions: { score: 82, detail: "Frequent blog posts on AI patterns. CEO discusses AI workflows regularly." },
      marketFit: { score: 92, detail: "v0 + AI SDK = massive consumption. Platform multiplier — their customers become Claude consumers." }
    },
    competitiveIntel: { currentStack: "Multi-provider via AI SDK (OpenAI default in examples)", pain: "v0 code gen quality directly impacts product perception.", switching: "Low friction — AI SDK abstracts providers. Default change is config-level." },
    useCases: [
      { name: "v0 Code Generation", potential: "Very High", consumption: "$50K–100K/mo", estimate: 75000, description: "Claude as primary model for v0's React/Next.js code gen." },
      { name: "AI SDK Default Provider", potential: "High", consumption: "Platform multiplier", estimate: 40000, description: "Claude as recommended default in AI SDK docs." },
      { name: "Docs Chat", potential: "Medium", consumption: "$5K–10K/mo", estimate: 7500, description: "RAG-powered docs assistant for Next.js." }
    ],
    outreachAngles: [
      { type: "Strategic", angle: "Making Claude the AI SDK default = every Vercel developer starts with Claude. Massive distribution play." },
      { type: "Technical", angle: "Claude's extended thinking could help v0 handle complex multi-file generation." }
    ],
    briefing: { trigger: "expansion", reason: "v0 usage up 18% MoM. AI SDK 4.0 launch driving new integrations. Window to push for default provider status.", action: "Propose co-marketing partnership around AI SDK 4.0 launch." },
    engagement: { lastTouch: "1 week ago", touchType: "Email", nextStep: "Follow up on AI SDK partnership proposal", playbook: "upsell" }
  },
  {
    id: 3, name: "Perplexity", domain: "perplexity.ai", logo: "P", industry: "AI Search", segment: "Growth",
    employees: "200–400", funding: "Series B — $250M", hq: "San Francisco, CA",
    description: "AI-powered answer engine combining search with LLM reasoning for direct answers.",
    health: 90, breakout: 92, tier: "star", acv: "$1.5M–3M", champion: "CTO / VP Infra",
    mrr: "$145K", mrrTrend: "+22%", apiCalls: "35M/mo",
    usageTrend: [38, 45, 52, 60, 72, 80, 92, 105, 115, 128, 138, 145],
    signals: {
      aiJobs: { score: 92, detail: "Entire company built on LLMs. Hiring infra engineers for scale." },
      githubActivity: { score: 70, detail: "Some open-source tools. Core product closed-source." },
      techStack: { score: 92, detail: "Multi-model orchestration. Quality and speed per dollar are the key metrics." },
      fundingMomentum: { score: 95, detail: "$250M Series B. One of fastest-growing AI consumer products." },
      blogMentions: { score: 90, detail: "Constant media coverage. CEO actively discusses multi-model strategy." },
      marketFit: { score: 95, detail: "Every query = API call. Massive token volume. Multi-model means Claude share can grow." }
    },
    competitiveIntel: { currentStack: "Multi-model: Claude, GPT-4, Gemini, Mistral", pain: "Cost per query at scale. Need best quality-per-dollar ratio.", switching: "Multi-model already — increase Claude's share of query routing." },
    useCases: [
      { name: "Answer Generation", potential: "Very High", consumption: "$100K–250K/mo", estimate: 175000, description: "Claude for complex reasoning queries requiring accuracy." },
      { name: "Source Synthesis", potential: "High", consumption: "$30K–60K/mo", estimate: 45000, description: "Synthesize multiple sources into coherent answers." }
    ],
    outreachAngles: [
      { type: "Quality", angle: "Claude's accuracy advantage on complex reasoning queries could improve Perplexity's answer quality metrics." },
      { type: "Economics", angle: "Sonnet 4 offers better quality-per-dollar — share benchmarks for their query mix." }
    ],
    briefing: { trigger: "expansion", reason: "Usage surging +22% MoM. Perplexity's MAU hit 100M. More queries = more Claude API calls. Time to negotiate volume pricing and expand share.", action: "Send volume pricing proposal and Sonnet 4 quality benchmarks." },
    engagement: { lastTouch: "5 days ago", touchType: "Call", nextStep: "Share Sonnet 4 benchmark data", playbook: "upsell" }
  },
  {
    id: 4, name: "Ramp", domain: "ramp.com", logo: "R", industry: "Fintech", segment: "Growth",
    employees: "800–1,200", funding: "Series D — $300M", hq: "New York, NY",
    description: "Corporate card and spend management automating expense reporting and accounting.",
    health: 82, breakout: 78, tier: "steady", acv: "$400K–600K", champion: "VP Eng / Head of AI",
    mrr: "$38K", mrrTrend: "+8%", apiCalls: "5.2M/mo",
    usageTrend: [18, 20, 22, 24, 26, 28, 30, 32, 34, 35, 37, 38],
    signals: {
      aiJobs: { score: 92, detail: "12 open AI/ML roles including 'Head of AI Products'." },
      githubActivity: { score: 78, detail: "Public repos using LangChain and OpenAI SDKs." },
      techStack: { score: 85, detail: "Python/FastAPI + React. GPT-4 for receipt parsing." },
      fundingMomentum: { score: 95, detail: "$300M Series D at $5.8B valuation." },
      blogMentions: { score: 70, detail: "CEO mentioned 'AI-first expense management' in TechCrunch." },
      marketFit: { score: 88, detail: "Transaction categorization, anomaly detection, doc extraction at scale." }
    },
    competitiveIntel: { currentStack: "OpenAI GPT-4 primary, some Cohere for embeddings", pain: "Rate limits and latency on high-volume transaction processing.", switching: "Medium — wrapper architecture allows provider swap." },
    useCases: [
      { name: "Receipt Extraction", potential: "High", consumption: "$15K–25K/mo", estimate: 20000, description: "Millions of receipts monthly via Claude vision + structured output." },
      { name: "Expense Categorization", potential: "High", consumption: "$8K–15K/mo", estimate: 12000, description: "Classify transactions into GL codes." },
      { name: "Fraud Detection", potential: "Medium", consumption: "$5K–10K/mo", estimate: 7500, description: "Flag suspicious transaction patterns." }
    ],
    outreachAngles: [
      { type: "Pain Point", angle: "Your team posted about GPT-4 rate limits on transaction processing — Claude's throughput could eliminate that." },
      { type: "Competitive", angle: "Brex just announced their Claude integration — staying competitive means evaluating best models." }
    ],
    briefing: null,
    engagement: { lastTouch: "2 weeks ago", touchType: "Email", nextStep: "Share Claude vision API benchmarks for receipt extraction", playbook: "plateau" }
  },
  {
    id: 5, name: "Notion", domain: "notion.so", logo: "N", industry: "Productivity", segment: "Enterprise",
    employees: "1,000–1,500", funding: "Series C — $275M", hq: "San Francisco, CA",
    description: "All-in-one workspace with AI-powered writing, Q&A, and knowledge management.",
    health: 70, breakout: 84, tier: "watch", acv: "$1M–2M", champion: "Head of Notion AI",
    mrr: "$52K", mrrTrend: "-3%", apiCalls: "8M/mo",
    usageTrend: [48, 50, 52, 55, 58, 56, 55, 54, 53, 53, 52, 52],
    signals: {
      aiJobs: { score: 85, detail: "10+ AI/ML roles open. Notion AI is flagship feature." },
      githubActivity: { score: 60, detail: "Primarily closed-source. Some open-source connectors." },
      techStack: { score: 80, detail: "React + Kotlin backend. AI deeply integrated in editor." },
      fundingMomentum: { score: 82, detail: "$10B valuation. AI driving enterprise tier upgrades." },
      blogMentions: { score: 90, detail: "Heavy marketing around Notion AI. CEO positions AI as central." },
      marketFit: { score: 85, detail: "Writing assistance, summarization, Q&A — high token consumption per user." }
    },
    competitiveIntel: { currentStack: "OpenAI GPT-4 (primary provider for Notion AI)", pain: "Writing quality directly impacts user perception. Need nuanced, context-aware responses.", switching: "Medium-High — deeply integrated but single-provider risk." },
    useCases: [
      { name: "Writing Assistant", potential: "Very High", consumption: "$80K–150K/mo", estimate: 115000, description: "Drafting, editing, tone adjustment across millions of docs." },
      { name: "Workspace Q&A", potential: "High", consumption: "$30K–60K/mo", estimate: 45000, description: "RAG over workspace for enterprise knowledge retrieval." }
    ],
    outreachAngles: [
      { type: "Quality", angle: "Claude outperforms on nuanced writing — Notion AI's core value. A/B test could show measurable quality gains." },
      { type: "Risk", angle: "Single-provider dependency on OpenAI is strategic risk. Claude provides leverage and redundancy." }
    ],
    briefing: { trigger: "churn", reason: "Usage declined 3% MoM for the third consecutive month. Engagement has gone quiet — last meaningful conversation was 6 weeks ago. Possible evaluation of competitors.", action: "Immediate check-in call. Come prepared with Claude writing quality benchmarks vs. GPT-4." },
    engagement: { lastTouch: "6 weeks ago", touchType: "Email (no reply)", nextStep: "Direct call to Head of Notion AI", playbook: "churn" }
  },
  {
    id: 6, name: "Harvey", domain: "harvey.ai", logo: "H", industry: "Legal Tech", segment: "Growth",
    employees: "200–400", funding: "Series C — $100M", hq: "San Francisco, CA",
    description: "AI for legal professionals — contract analysis, research, due diligence.",
    health: 65, breakout: 82, tier: "watch", acv: "$1M–3M", champion: "CTO / VP Product",
    mrr: "$28K", mrrTrend: "+2%", apiCalls: "3.8M/mo",
    usageTrend: [15, 16, 18, 20, 22, 23, 24, 25, 26, 26, 27, 28],
    signals: {
      aiJobs: { score: 90, detail: "Hiring across AI/ML and legal domain experts." },
      githubActivity: { score: 40, detail: "Closed-source. Minimal public repos." },
      techStack: { score: 88, detail: "Python, custom fine-tuning pipeline, heavy RAG." },
      fundingMomentum: { score: 92, detail: "Backed by Sequoia and OpenAI. $100M+ raised." },
      blogMentions: { score: 75, detail: "Featured in legal press. Partners with A&O, PwC." },
      marketFit: { score: 90, detail: "Long-context reasoning and precision — Claude's strengths." }
    },
    competitiveIntel: { currentStack: "OpenAI (strategic investor and primary provider)", pain: "Legal accuracy is non-negotiable. Hallucinations = malpractice risk.", switching: "High — OpenAI is strategic investor. But multi-model is a governance demand." },
    useCases: [
      { name: "Contract Analysis", potential: "Very High", consumption: "$100K–200K/mo", estimate: 150000, description: "Review and redline contracts with long-context precision." },
      { name: "Legal Research", potential: "High", consumption: "$50K–100K/mo", estimate: 75000, description: "Case law analysis and citation verification." }
    ],
    outreachAngles: [
      { type: "Reliability", angle: "Claude's focus on reducing hallucinations maps directly to legal's zero-tolerance for inaccuracy." },
      { type: "Governance", angle: "Single-provider dependency on an investor creates governance concerns for law firm clients." }
    ],
    briefing: null,
    engagement: { lastTouch: "3 weeks ago", touchType: "Email", nextStep: "Propose multi-model pilot for contract analysis", playbook: "plateau" }
  },
  {
    id: 7, name: "Replit", domain: "replit.com", logo: "Re", industry: "Dev Tools", segment: "Growth",
    employees: "200–400", funding: "Series B — $97M", hq: "San Francisco, CA",
    description: "Browser-based IDE with AI code generation and deployment.",
    health: 85, breakout: 88, tier: "star", acv: "$500K–1M", champion: "CEO / Head of AI",
    mrr: "$55K", mrrTrend: "+15%", apiCalls: "9M/mo",
    usageTrend: [18, 22, 25, 28, 32, 35, 38, 42, 45, 48, 52, 55],
    signals: {
      aiJobs: { score: 88, detail: "AI is core product. Replit Agent is their flagship AI feature." },
      githubActivity: { score: 82, detail: "Active open-source presence. Replit Agent gaining community traction." },
      techStack: { score: 90, detail: "Custom IDE + AI middleware. Multi-model for different tasks." },
      fundingMomentum: { score: 80, detail: "$97M Series B. Pivoting from IDE to AI-powered development platform." },
      blogMentions: { score: 85, detail: "CEO frequently discusses AI coding and model quality." },
      marketFit: { score: 92, detail: "Replit Agent = sustained multi-turn API calls. High token consumption per session." }
    },
    competitiveIntel: { currentStack: "Multi-model: Claude, GPT-4, Google models", pain: "Agent quality directly determines product value. Multi-step reasoning is critical.", switching: "Multi-model — increase Claude's share of agent sessions." },
    useCases: [
      { name: "Replit Agent", potential: "Very High", consumption: "$40K–80K/mo", estimate: 60000, description: "Multi-step coding agent for app generation." },
      { name: "Code Completions", potential: "High", consumption: "$15K–30K/mo", estimate: 22500, description: "Inline completions across languages." }
    ],
    outreachAngles: [
      { type: "Quality", angle: "Claude's multi-step reasoning advantage maps directly to Replit Agent's core loop." },
      { type: "Growth", angle: "Replit Agent usage is exploding — lock in volume pricing now before consumption doubles." }
    ],
    briefing: { trigger: "expansion", reason: "Replit Agent usage surging +15% MoM. New 'Deploy' feature generating longer, more complex agent sessions. Volume pricing conversation needed.", action: "Propose volume discount tier to capture growing agent consumption." },
    engagement: { lastTouch: "4 days ago", touchType: "Slack", nextStep: "Send volume pricing proposal", playbook: "upsell" }
  },
  {
    id: 8, name: "Retool", domain: "retool.com", logo: "Rt", industry: "Dev Tools", segment: "Growth",
    employees: "400–600", funding: "Series C — $145M", hq: "San Francisco, CA",
    description: "Low-code platform for internal tools with AI-powered querying.",
    health: 75, breakout: 72, tier: "steady", acv: "$150K–250K", champion: "VP Product",
    mrr: "$14K", mrrTrend: "+5%", apiCalls: "1.8M/mo",
    usageTrend: [8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 14],
    signals: {
      aiJobs: { score: 72, detail: "5 roles mentioning AI/ML. Launched Retool AI features." },
      githubActivity: { score: 65, detail: "Open-source component library. Some AI templates." },
      techStack: { score: 75, detail: "React + Node.js. Adding NL-to-SQL modules." },
      fundingMomentum: { score: 70, detail: "Steady growth. AI as competitive differentiation." },
      blogMentions: { score: 68, detail: "Blog posts on AI-assisted tool development." },
      marketFit: { score: 80, detail: "NL-to-SQL, code gen — scales with user base." }
    },
    competitiveIntel: { currentStack: "OpenAI GPT-4 for AI features", pain: "SQL accuracy critical — wrong queries on production DBs are costly.", switching: "Low — AI features are new and modular." },
    useCases: [
      { name: "NL-to-SQL", potential: "High", consumption: "$10K–20K/mo", estimate: 15000, description: "Convert English to accurate SQL across schemas." },
      { name: "Component Code Gen", potential: "Medium", consumption: "$5K–10K/mo", estimate: 7500, description: "Generate JS/Python for custom components." }
    ],
    outreachAngles: [
      { type: "Accuracy", angle: "Claude's structured output delivers higher SQL accuracy — critical for production databases." }
    ],
    briefing: null,
    engagement: { lastTouch: "10 days ago", touchType: "Email", nextStep: "Share SQL benchmark results", playbook: "plateau" }
  },
  {
    id: 9, name: "Weights & Biases", domain: "wandb.ai", logo: "W&B", industry: "ML Infra", segment: "Growth",
    employees: "300–500", funding: "Series C — $135M", hq: "San Francisco, CA",
    description: "ML experiment tracking, model monitoring, and LLM evaluation platform.",
    health: 78, breakout: 68, tier: "steady", acv: "$100K–200K", champion: "VP Product",
    mrr: "$9K", mrrTrend: "+3%", apiCalls: "1.2M/mo",
    usageTrend: [5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 9, 9],
    signals: {
      aiJobs: { score: 80, detail: "Hiring for LLM eval features." },
      githubActivity: { score: 85, detail: "Popular OSS integrations. Weave framework growing." },
      techStack: { score: 82, detail: "Python-heavy. Building LLM observability." },
      fundingMomentum: { score: 75, detail: "Solid Series C. Pivoting to include LLM tooling." },
      blogMentions: { score: 72, detail: "Regular LLM evaluation content." },
      marketFit: { score: 70, detail: "Moderate direct consumption but strategic partnership value." }
    },
    competitiveIntel: { currentStack: "Multi-provider for eval purposes", pain: "Integration quality affects platform perception.", switching: "Low — eval platforms are model-agnostic." },
    useCases: [
      { name: "LLM Eval Suite", potential: "Medium", consumption: "$10K–25K/mo", estimate: 17500, description: "Claude as judge model for output evaluation." }
    ],
    outreachAngles: [
      { type: "Partnership", angle: "Claude in W&B's eval suite gives Anthropic visibility across ML practitioner community." }
    ],
    briefing: null,
    engagement: { lastTouch: "2 weeks ago", touchType: "Email", nextStep: "Propose Weave integration partnership", playbook: "plateau" }
  },
  {
    id: 10, name: "Loom", domain: "loom.com", logo: "Lo", industry: "Productivity", segment: "Enterprise",
    employees: "300–500", funding: "Acquired — Atlassian ($975M)", hq: "San Francisco, CA",
    description: "Async video messaging. Acquired by Atlassian in 2023.",
    health: 42, breakout: 35, tier: "critical", acv: "$50K–100K", champion: "Atlassian AI Platform",
    mrr: "$4K", mrrTrend: "-15%", apiCalls: "420K/mo",
    usageTrend: [12, 11, 10, 9, 8, 7, 7, 6, 6, 5, 5, 4],
    signals: {
      aiJobs: { score: 55, detail: "3 ML roles. AI focused on transcription/summarization." },
      githubActivity: { score: 35, detail: "Minimal public repos." },
      techStack: { score: 65, detail: "React + Node. AI layered for transcription." },
      fundingMomentum: { score: 50, detail: "Acquired by Atlassian. Decisions route through parent." },
      blogMentions: { score: 45, detail: "Some AI feature mentions but not primary positioning." },
      marketFit: { score: 60, detail: "Video summarization — moderate consumption, commodity use case." }
    },
    competitiveIntel: { currentStack: "Whisper for transcription, GPT for summarization", pain: "Summarization quality varies. Atlassian demands enterprise quality.", switching: "Routes through Atlassian's broader AI strategy." },
    useCases: [
      { name: "Video Summarization", potential: "Medium", consumption: "$5K–10K/mo", estimate: 7500, description: "Auto-generate summaries and action items." }
    ],
    outreachAngles: [
      { type: "Enterprise", angle: "As Loom integrates into Atlassian's enterprise suite, AI quality becomes table-stakes." }
    ],
    briefing: { trigger: "churn", reason: "Usage down 15% MoM — steepest decline in portfolio. API calls dropped from 12M to 420K over 12 months. Atlassian may be consolidating AI providers internally.", action: "Urgent call to Atlassian AI Platform team. Understand if this is strategic consolidation or dissatisfaction." },
    engagement: { lastTouch: "8 weeks ago", touchType: "Email (no reply)", nextStep: "Escalate to Atlassian AI Platform lead", playbook: "churn" }
  },
  {
    id: 11, name: "Jasper", domain: "jasper.ai", logo: "J", industry: "Content AI", segment: "Growth",
    employees: "300–500", funding: "Series A — $125M", hq: "Austin, TX",
    description: "AI content creation platform for marketing teams.",
    health: 38, breakout: 45, tier: "critical", acv: "$200K–400K", champion: "CTO",
    mrr: "$18K", mrrTrend: "-22%", apiCalls: "2.1M/mo",
    usageTrend: [65, 62, 58, 52, 48, 42, 38, 35, 30, 26, 22, 18],
    signals: {
      aiJobs: { score: 75, detail: "Hiring ML engineers. Pivoting from wrapper to platform." },
      githubActivity: { score: 45, detail: "Closed-source. API client libraries only." },
      techStack: { score: 72, detail: "Node.js backend. Multi-model architecture." },
      fundingMomentum: { score: 55, detail: "Valuation pressure. Layoffs in 2024." },
      blogMentions: { score: 60, detail: "Repositioning from 'AI writer' to 'AI marketing platform'." },
      marketFit: { score: 65, detail: "Content generation is commoditizing. Need differentiation." }
    },
    competitiveIntel: { currentStack: "Was primarily Claude, now shifting to multi-model + in-house", pain: "Struggling to differentiate as content AI commoditizes. Cost pressure.", switching: "Active risk — may be building in-house models to reduce API dependency." },
    useCases: [
      { name: "Marketing Copy Gen", potential: "Medium", consumption: "$15K–30K/mo", estimate: 22000, description: "Blog posts, ads, social media content generation." }
    ],
    outreachAngles: [
      { type: "Retention", angle: "Jasper's differentiation depends on output quality — commodity models won't cut it. Claude's writing quality is their competitive moat." }
    ],
    briefing: { trigger: "churn", reason: "CRITICAL: Usage dropped 22% MoM. Was a top-10 account — now declining steeply. Intel suggests they're building in-house models. Risk of total churn within 2 quarters.", action: "Emergency call to CTO. Offer custom pricing / dedicated support. Understand their in-house model strategy." },
    engagement: { lastTouch: "5 weeks ago", touchType: "Email", nextStep: "Urgent executive outreach", playbook: "churn" }
  },
  {
    id: 12, name: "Coda", domain: "coda.io", logo: "Co", industry: "Productivity", segment: "Growth",
    employees: "400–600", funding: "Series D — $140M", hq: "San Francisco, CA",
    description: "All-in-one doc platform with tables, automations, and AI features.",
    health: 58, breakout: 55, tier: "watch", acv: "$100K–200K", champion: "VP Product",
    mrr: "$8K", mrrTrend: "-5%", apiCalls: "1M/mo",
    usageTrend: [12, 12, 11, 11, 10, 10, 10, 9, 9, 9, 8, 8],
    signals: {
      aiJobs: { score: 65, detail: "3 AI roles. AI assistant integrated into doc editor." },
      githubActivity: { score: 50, detail: "Some open-source packs. Limited AI visibility." },
      techStack: { score: 70, detail: "React + custom backend. AI features layered on." },
      fundingMomentum: { score: 60, detail: "Solid but not aggressive growth." },
      blogMentions: { score: 55, detail: "Some AI feature announcements." },
      marketFit: { score: 65, detail: "Doc AI features — moderate consumption." }
    },
    competitiveIntel: { currentStack: "Claude for AI features, evaluating alternatives", pain: "AI champion recently left the company. New product lead less committed to AI investment.", switching: "Medium — champion departure creates uncertainty." },
    useCases: [
      { name: "Doc AI Assistant", potential: "Medium", consumption: "$6K–12K/mo", estimate: 9000, description: "Writing, summarization, and formula generation." }
    ],
    outreachAngles: [
      { type: "Re-engagement", angle: "New product lead may need education on Claude's value. Offer a custom demo focused on their top use cases." }
    ],
    briefing: { trigger: "churn", reason: "AI champion (VP Eng) left Coda 3 weeks ago. Usage slowly declining. New product lead hasn't been contacted yet. Window to build relationship before they evaluate alternatives.", action: "Reach out to new product lead with intro email + offer custom demo session." },
    engagement: { lastTouch: "4 weeks ago", touchType: "Email to former champion", nextStep: "Identify and contact new product lead", playbook: "churn" }
  },
  {
    id: 13, name: "Ironclad", domain: "ironcladapp.com", logo: "Ic", industry: "Legal Tech", segment: "Growth",
    employees: "400–600", funding: "Series E — $150M", hq: "San Francisco, CA",
    description: "Contract lifecycle management with AI-powered review and extraction.",
    health: 76, breakout: 70, tier: "steady", acv: "$200K–400K", champion: "Head of AI",
    mrr: "$22K", mrrTrend: "+6%", apiCalls: "2.8M/mo",
    usageTrend: [12, 13, 14, 15, 16, 16, 17, 18, 19, 20, 21, 22],
    signals: {
      aiJobs: { score: 78, detail: "6 AI roles. Building AI-native contract review." },
      githubActivity: { score: 50, detail: "Limited public repos. CLM platform is proprietary." },
      techStack: { score: 82, detail: "Python + React. RAG over contract corpus." },
      fundingMomentum: { score: 78, detail: "$150M Series E. AI-native features driving enterprise deals." },
      blogMentions: { score: 72, detail: "Regular content on AI in legal operations." },
      marketFit: { score: 85, detail: "Contract analysis = long-context + precision. Claude's sweet spot." }
    },
    competitiveIntel: { currentStack: "Claude (primary), some GPT-4 for specific tasks", pain: "Contract review accuracy is non-negotiable. Need consistent long-doc handling.", switching: "Already on Claude — opportunity is deeper integration." },
    useCases: [
      { name: "Contract Review", potential: "High", consumption: "$15K–30K/mo", estimate: 22000, description: "Automated clause extraction and risk flagging." },
      { name: "Contract Generation", potential: "Medium", consumption: "$5K–10K/mo", estimate: 7500, description: "Draft contracts from templates with custom terms." }
    ],
    outreachAngles: [
      { type: "Expansion", angle: "Ironclad is already on Claude — push deeper integration with new 200K context window for full-document analysis." }
    ],
    briefing: null,
    engagement: { lastTouch: "1 week ago", touchType: "QBR", nextStep: "Follow up on 200K context window beta access", playbook: "upsell" }
  },
  {
    id: 14, name: "Anyscale", domain: "anyscale.com", logo: "As", industry: "ML Infra", segment: "Growth",
    employees: "200–300", funding: "Series C — $100M", hq: "San Francisco, CA",
    description: "Ray-based platform for scaling AI/ML workloads and serving models.",
    health: 62, breakout: 72, tier: "watch", acv: "$80K–150K", champion: "VP Product",
    mrr: "$6K", mrrTrend: "0%", apiCalls: "800K/mo",
    usageTrend: [6, 7, 7, 6, 5, 5, 6, 7, 6, 5, 6, 6],
    signals: {
      aiJobs: { score: 75, detail: "Hiring for LLM serving and fine-tuning features." },
      githubActivity: { score: 88, detail: "Ray is massively popular OSS. Strong community." },
      techStack: { score: 78, detail: "Python. Ray for distributed compute. Adding LLM serving." },
      fundingMomentum: { score: 72, detail: "Series C. Pivoting from compute platform to AI platform." },
      blogMentions: { score: 68, detail: "Content on model serving and fine-tuning." },
      marketFit: { score: 70, detail: "Moderate direct consumption. Strategic for Claude on Ray integration." }
    },
    competitiveIntel: { currentStack: "Multi-model serving (open-source + API providers)", pain: "Usage inconsistent. New product launch could change trajectory.", switching: "Low — platform serves multiple models." },
    useCases: [
      { name: "LLM Serving Benchmarks", potential: "Medium", consumption: "$5K–10K/mo", estimate: 7500, description: "Claude as benchmark model for Ray Serve demos." }
    ],
    outreachAngles: [
      { type: "Partnership", angle: "Claude as the featured API model in Ray Serve documentation and tutorials." }
    ],
    briefing: null,
    engagement: { lastTouch: "3 weeks ago", touchType: "Email", nextStep: "Propose Ray Serve integration showcase", playbook: "reengagement" }
  },
  {
    id: 15, name: "Warp", domain: "warp.dev", logo: "W", industry: "Dev Tools", segment: "Startup",
    employees: "50–100", funding: "Series B — $50M", hq: "San Francisco, CA",
    description: "AI-powered terminal with natural language commands and workflow suggestions.",
    health: 73, breakout: 65, tier: "steady", acv: "$60K–120K", champion: "CTO",
    mrr: "$7K", mrrTrend: "+4%", apiCalls: "900K/mo",
    usageTrend: [3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7],
    signals: {
      aiJobs: { score: 72, detail: "4 AI roles. AI is core to terminal experience." },
      githubActivity: { score: 65, detail: "Some OSS tools. Terminal is closed-source." },
      techStack: { score: 78, detail: "Rust + custom AI layer. Multi-model for different tasks." },
      fundingMomentum: { score: 68, detail: "$50M Series B. Steady growth in developer user base." },
      blogMentions: { score: 62, detail: "Dev tool press coverage. AI terminal getting traction." },
      marketFit: { score: 72, detail: "Command generation and workflow suggestion. Moderate consumption." }
    },
    competitiveIntel: { currentStack: "Multi-model: Claude and GPT-4", pain: "Command accuracy is critical — wrong terminal commands can be destructive.", switching: "Multi-model — can shift allocation." },
    useCases: [
      { name: "Command Generation", potential: "Medium", consumption: "$4K–8K/mo", estimate: 6000, description: "NL to terminal commands." },
      { name: "Workflow Suggestions", potential: "Medium", consumption: "$3K–5K/mo", estimate: 4000, description: "Contextual workflow recommendations." }
    ],
    outreachAngles: [
      { type: "Quality", angle: "Claude's instruction following advantage reduces risk of generating destructive terminal commands." }
    ],
    briefing: null,
    engagement: { lastTouch: "2 weeks ago", touchType: "Email", nextStep: "Share command accuracy benchmark data", playbook: "plateau" }
  }
];

const DAILY_BRIEFING = ACCOUNTS.filter(a => a.briefing).sort((a, b) => {
  const order = { churn: 0, expansion: 1, milestone: 2, reengagement: 3 };
  return (order[a.briefing.trigger] ?? 5) - (order[b.briefing.trigger] ?? 5);
}).slice(0, 5);

/* ═══════════════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════════════ */

const SIGNAL_META = {
  aiJobs:          { label: "AI/ML Hiring",        icon: Briefcase,  color: C.terra },
  githubActivity:  { label: "GitHub Activity",      icon: Github,     color: "#6b5b4e" },
  techStack:       { label: "Tech Stack Fit",       icon: Code2,      color: "#7c6f5b" },
  fundingMomentum: { label: "Funding Momentum",     icon: TrendingUp, color: "#8b7355" },
  blogMentions:    { label: "Public AI Interest",    icon: BookOpen,   color: "#a0926e" },
  marketFit:       { label: "Market Fit for Claude", icon: Target,     color: C.terra }
};

function tierInfo(t) {
  if (t === "star")     return { label: "Star",     color: C.healthGood, bg: "rgba(107,143,94,0.09)", icon: Star };
  if (t === "steady")   return { label: "Steady",   color: "#8b7355",    bg: "rgba(139,115,85,0.09)", icon: Activity };
  if (t === "watch")    return { label: "Watch",    color: C.healthWatch,bg: "rgba(201,168,66,0.09)", icon: Eye };
  return                        { label: "Critical", color: C.healthCrit, bg: "rgba(161,61,45,0.09)",  icon: AlertTriangle };
}

function healthColor(score) {
  if (score >= 75) return C.healthGood;
  if (score >= 50) return C.healthWatch;
  return C.healthCrit;
}

const triggerMeta = {
  churn:         { label: "Churn Risk",    color: C.healthCrit,  icon: TrendingDown, bg: "rgba(161,61,45,0.07)" },
  expansion:     { label: "Expansion",     color: C.healthGood,  icon: Rocket,       bg: "rgba(107,143,94,0.07)" },
  milestone:     { label: "Milestone",     color: "#8b7355",     icon: Star,         bg: "rgba(139,115,85,0.07)" },
  reengagement:  { label: "Re-engage",     color: C.healthWatch, icon: Clock,        bg: "rgba(201,168,66,0.07)" },
};

const potentialColor = { "Very High": C.terra, High: "#8b7355", Medium: C.stone, Low: C.silver };

const PLAYBOOKS = {
  onboarding: { name: "Onboarding Success", steps: ["Day 1: Welcome + quick-start guide", "Day 7: Check-in on first integration", "Day 14: Share relevant case study", "Day 30: Schedule first QBR"] },
  plateau:    { name: "Usage Plateau",       steps: ["Analyze unused features", "Send targeted feature spotlight", "Offer SA-led technical deep-dive", "Share benchmark data vs. similar accounts"] },
  churn:      { name: "Churn Intervention",  steps: ["Immediate check-in (call, not email)", "Identify blocker: technical? business? champion left?", "Engage SA or support escalation", "Executive sponsor outreach"] },
  upsell:     { name: "Upsell Trigger",      steps: ["Send usage report with value narrative", "Preview features at next tier", "Propose custom pricing discussion", "QBR with decision makers"] },
  reengagement: { name: "Re-engagement",     steps: ["Lightweight 'checking in' email", "Share relevant product update", "Invite to upcoming webinar/event", "Direct ask for 15-min sync"] },
};

/* ═══════════════════════════════════════════════════════════════════════════════
   ROOT COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export default function ClaudAE() {
  const [mainView, setMainView] = useState("briefing");
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg); setTimeout(() => setToast(null), 2800);
  }, []);

  const selected = ACCOUNTS.find(a => a.id === selectedId);

  return (
    <div style={{ fontFamily: serif, background: C.parchment, color: C.nearBlack, minHeight: "100vh", position: "relative" }}>

      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 999,
          background: C.nearBlack, color: C.ivory, fontFamily: sans, fontSize: 13, fontWeight: 500,
          padding: "10px 24px", borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          display: "flex", alignItems: "center", gap: 8, animation: "fadeSlideUp .3s ease",
        }}>
          <Check size={15} color={C.coral} /> {toast}
        </div>
      )}

      {/* Header */}
      <header style={{
        background: C.ivory, borderBottom: `1px solid ${C.borderL}`,
        padding: "0 28px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50, boxShadow: whisper,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: C.terra, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Sparkles size={16} color={C.ivory} />
          </div>
          <span style={{ fontSize: 19, fontWeight: 500, letterSpacing: -0.5 }}>ClaudAE</span>
          <span style={{
            fontFamily: sans, fontSize: 10.5, fontWeight: 500, color: C.stone,
            letterSpacing: .5, textTransform: "uppercase", marginLeft: 2,
          }}>by Zi Pan</span>
        </div>

        <div style={{
          display: "flex", gap: 2, background: C.sand, borderRadius: 9, padding: 3,
          boxShadow: ring(C.ringW),
        }}>
          {[
            { k: "briefing", l: "Daily Briefing", i: Bell },
            { k: "heatmap", l: "Portfolio", i: Grid3X3 },
          ].map(({ k, l, i: Icon }) => (
            <button key={k} onClick={() => { setMainView(k); setSelectedId(null); }} style={{
              fontFamily: sans, fontSize: 12, fontWeight: 500, padding: "5px 14px", borderRadius: 7,
              border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
              background: mainView === k ? C.white : "transparent",
              color: mainView === k ? C.nearBlack : C.stone,
              boxShadow: mainView === k ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
              transition: "all .2s",
            }}>
              <Icon size={13} /> {l}
            </button>
          ))}
        </div>
      </header>

      {/* Main layout */}
      <div style={{ display: "flex", height: "calc(100vh - 56px)", overflow: "hidden" }}>

        {/* Left panel — no overflow here; scrolling handled by inner wrapper */}
        <div style={{
          width: selected ? 420 : "100%",
          borderRight: selected ? `1px solid ${C.borderL}` : "none",
          background: selected ? C.ivory : C.parchment,
          display: "flex", flexDirection: "column",
          transition: "width .35s cubic-bezier(.4,0,.2,1)",
        }}>
          <div style={{ flex: 1, overflow: "auto" }}>
            {mainView === "briefing" ? (
              <BriefingView accounts={DAILY_BRIEFING} onSelect={setSelectedId} selectedId={selectedId} />
            ) : (
              <HeatmapView accounts={ACCOUNTS} onSelect={setSelectedId} selectedId={selectedId} />
            )}
          </div>
        </div>

        {/* Right: Detail — this panel stretches to the viewport edge, so its scrollbar is far-right */}
        {selected && (
          <div style={{ flex: 1, overflow: "auto", background: C.parchment, animation: "fadeIn .25s ease" }}>
            <AccountDetail account={selected} onClose={() => setSelectedId(null)} showToast={showToast} />
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translate(-50%,12px)} to{opacity:1;transform:translate(-50%,0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideIn { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${C.borderM};border-radius:3px}
        input:focus,textarea:focus{outline:2px solid #3898ec;outline-offset:-1px}
        button:hover{opacity:.88}
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   DAILY BRIEFING VIEW
   ═══════════════════════════════════════════════════════════════════════════════ */

function BriefingView({ accounts, onSelect, selectedId }) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  return (
    <div style={{ padding: "28px 24px 40px", maxWidth: 700, margin: "0 auto", width: "100%" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 500, lineHeight: 1.15, marginBottom: 6 }}>Good morning, Zi.</h1>
        <p style={{ fontFamily: sans, fontSize: 14, color: C.olive, lineHeight: 1.5 }}>
          {today} — Here are the {accounts.length} accounts that need your attention today.
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Total Accounts", value: ACCOUNTS.length, color: C.nearBlack },
          { label: "Stars", value: ACCOUNTS.filter(a => a.tier === "star").length, color: C.healthGood },
          { label: "At Risk", value: ACCOUNTS.filter(a => a.tier === "critical").length, color: C.healthCrit },
          { label: "Portfolio MRR", value: "$" + (ACCOUNTS.reduce((s, a) => s + parseInt(a.mrr.replace(/[^0-9]/g, "")), 0)).toLocaleString() + "K", color: C.terra },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            flex: 1, background: C.white, borderRadius: 12, padding: "14px 16px",
            border: `1px solid ${C.borderL}`, boxShadow: whisper,
          }}>
            <div style={{ fontFamily: sans, fontSize: 10, color: C.stone, textTransform: "uppercase", letterSpacing: .5, marginBottom: 4 }}>{label}</div>
            <div style={{ fontFamily: serif, fontSize: 22, fontWeight: 500, color }}>{value}</div>
          </div>
        ))}
      </div>

      {accounts.map((a, i) => {
        const trigger = triggerMeta[a.briefing.trigger];
        const TrigIcon = trigger.icon;
        const isSelected = selectedId === a.id;
        return (
          <div key={a.id} onClick={() => onSelect(a.id)} style={{
            background: C.white, borderRadius: 14, padding: "20px 22px",
            border: `1px solid ${isSelected ? C.terra : C.borderL}`,
            boxShadow: isSelected ? `0 0 0 1px ${C.terra}, ${whisper}` : whisper,
            marginBottom: 12, animation: `fadeSlideIn .4s ease ${i * .07}s both`,
            cursor: "pointer", transition: "all .2s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 10, background: C.nearBlack,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: serif, fontSize: 15, fontWeight: 500, color: C.ivory, flexShrink: 0, letterSpacing: -.5,
              }}>{a.logo}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 500 }}>{a.name}</span>
                  <span style={{
                    fontFamily: sans, fontSize: 10, fontWeight: 600, color: trigger.color,
                    background: trigger.bg, padding: "2px 9px", borderRadius: 20,
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    <TrigIcon size={11} /> {trigger.label}
                  </span>
                </div>
                <div style={{ fontFamily: sans, fontSize: 12, color: C.stone }}>{a.industry} · {a.mrr} MRR ({a.mrrTrend})</div>
              </div>
              <MiniHealthRing health={a.health} size={38} />
            </div>
            <div style={{
              background: trigger.bg, borderRadius: 9, padding: "11px 14px", marginBottom: 12,
              border: `1px solid ${trigger.color}18`,
            }}>
              <p style={{ fontFamily: sans, fontSize: 13, lineHeight: 1.5, color: C.charcoal }}>{a.briefing.reason}</p>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <Lightbulb size={14} color={C.terra} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontFamily: sans, fontSize: 12.5, lineHeight: 1.45, color: C.olive }}>
                <strong style={{ color: C.nearBlack }}>Action:</strong> {a.briefing.action}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PORTFOLIO HEATMAP VIEW
   ═══════════════════════════════════════════════════════════════════════════════ */

function HeatmapView({ accounts, onSelect, selectedId }) {
  const [filterTier, setFilterTier] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("health");

  const filtered = useMemo(() => {
    let l = [...accounts];
    if (search) { const q = search.toLowerCase(); l = l.filter(a => a.name.toLowerCase().includes(q) || a.industry.toLowerCase().includes(q)); }
    if (filterTier !== "all") l = l.filter(a => a.tier === filterTier);
    if (sort === "health") l.sort((a, b) => b.health - a.health);
    else if (sort === "breakout") l.sort((a, b) => b.breakout - a.breakout);
    else l.sort((a, b) => a.name.localeCompare(b.name));
    return l;
  }, [accounts, search, filterTier, sort]);

  return (
    <div style={{ padding: "20px 20px 40px" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, background: C.white,
          borderRadius: 9, padding: "7px 11px", border: `1px solid ${C.borderL}`, marginBottom: 10,
        }}>
          <Search size={15} color={C.stone} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search accounts..."
            style={{ border: "none", background: "transparent", outline: "none", fontFamily: sans, fontSize: 13, color: C.nearBlack, width: "100%" }} />
          {search && <button onClick={() => setSearch("")} style={{ border: "none", background: "none", cursor: "pointer", display: "flex" }}><X size={13} color={C.stone} /></button>}
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
          {["all", "star", "steady", "watch", "critical"].map(t => {
            const ti = t === "all" ? { color: C.nearBlack } : tierInfo(t);
            return (
              <button key={t} onClick={() => setFilterTier(t)} style={{
                fontFamily: sans, fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 18,
                border: `1px solid ${filterTier === t ? ti.color : C.borderM}`,
                background: filterTier === t ? `${ti.color}11` : C.white,
                color: filterTier === t ? ti.color : C.olive, cursor: "pointer", textTransform: "capitalize",
              }}>
                {t === "all" ? "All" : t}
              </button>
            );
          })}
          <select value={sort} onChange={e => setSort(e.target.value)} style={{
            marginLeft: "auto", fontFamily: sans, fontSize: 11, padding: "3px 8px", borderRadius: 6,
            border: `1px solid ${C.borderM}`, background: C.white, color: C.olive, cursor: "pointer",
          }}>
            <option value="health">Sort: Health</option>
            <option value="breakout">Sort: Breakout</option>
            <option value="name">Sort: A-Z</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: 10 }}>
        {filtered.map((a, i) => {
          const ti = tierInfo(a.tier);
          const TIcon = ti.icon;
          const isSelected = selectedId === a.id;
          return (
            <button key={a.id} onClick={() => onSelect(a.id)} style={{
              background: C.white, borderRadius: 12, padding: "16px 14px",
              border: `1px solid ${isSelected ? C.terra : C.borderL}`,
              boxShadow: isSelected ? `0 0 0 1px ${C.terra}` : whisper,
              cursor: "pointer", textAlign: "left", transition: "all .2s",
              animation: `fadeSlideIn .35s ease ${i * .03}s both`,
              position: "relative", overflow: "hidden",
            }}>
              {a.briefing && (
                <div style={{
                  position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: 4,
                  background: triggerMeta[a.briefing.trigger].color,
                  animation: a.tier === "critical" ? "pulse 2s infinite" : "none",
                }} />
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, background: C.nearBlack,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: serif, fontSize: 12, fontWeight: 500, color: C.ivory, letterSpacing: -.3,
                }}>{a.logo}</div>
                <div>
                  <div style={{ fontFamily: serif, fontSize: 13.5, fontWeight: 500, lineHeight: 1.2 }}>{a.name}</div>
                  <div style={{ fontFamily: sans, fontSize: 10.5, color: C.stone }}>{a.industry}</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontFamily: sans, fontSize: 10, color: C.stone, textTransform: "uppercase", letterSpacing: .4 }}>Health</div>
                  <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 500, color: healthColor(a.health) }}>{a.health}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: sans, fontSize: 10, color: C.stone, textTransform: "uppercase", letterSpacing: .4 }}>Breakout</div>
                  <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 500, color: a.breakout >= 75 ? C.healthGood : a.breakout >= 50 ? C.healthWatch : C.stone }}>{a.breakout}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 3, marginTop: 8 }}>
                <div style={{ flex: a.health, height: 3, borderRadius: 2, background: healthColor(a.health), transition: "all .5s" }} />
                <div style={{ flex: 100 - a.health, height: 3, borderRadius: 2, background: C.borderL }} />
              </div>
              <div style={{
                fontFamily: sans, fontSize: 10.5, color: ti.color, marginTop: 8,
                display: "flex", alignItems: "center", gap: 4,
              }}>
                <TIcon size={11} /> {ti.label} · {a.mrr}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   ACCOUNT DETAIL
   ═══════════════════════════════════════════════════════════════════════════════ */

function AccountDetail({ account: a, onClose, showToast }) {
  const [tab, setTab] = useState("overview");
  const ti = tierInfo(a.tier);

  const tabs = [
    { k: "overview", l: "Overview", i: Activity },
    { k: "signals", l: "Signals", i: Zap },
    { k: "usecases", l: "Use Cases", i: Layers },
    { k: "engagement", l: "Playbook", i: PlayCircle },
    { k: "outreach", l: "Outreach", i: MessageSquare },
  ];

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "22px 28px 56px" }}>
      <button onClick={onClose} style={{
        border: "none", background: "none", cursor: "pointer", fontFamily: sans,
        fontSize: 12, color: C.stone, display: "flex", alignItems: "center", gap: 5, marginBottom: 16,
      }}><X size={13} /> Close</button>

      <div style={{
        background: C.nearBlack, borderRadius: 14, padding: "24px 26px", color: C.ivory,
        marginBottom: 20, animation: "slideIn .35s ease",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 10, background: C.dark,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, fontWeight: 500, border: `1px solid ${C.olive}33`, letterSpacing: -.5,
              }}>{a.logo}</div>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.15 }}>{a.name}</h1>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                  <span style={{ fontFamily: sans, fontSize: 12, color: C.silver }}>{a.domain}</span>
                  <span style={{
                    fontFamily: sans, fontSize: 10, fontWeight: 600, color: ti.color,
                    background: `${ti.color}22`, padding: "1px 8px", borderRadius: 12,
                  }}>{ti.label}</span>
                </div>
              </div>
            </div>
            <p style={{ fontFamily: sans, fontSize: 13, lineHeight: 1.5, color: C.silver, maxWidth: 380 }}>{a.description}</p>
          </div>
          <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
            <ScoreRing label="Health" score={a.health} color={healthColor(a.health)} />
            <ScoreRing label="Breakout" score={a.breakout} color={a.breakout >= 75 ? C.healthGood : a.breakout >= 50 ? C.healthWatch : C.stone} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 18, paddingTop: 16, borderTop: `1px solid ${C.dark}`, flexWrap: "wrap" }}>
          {[
            { i: DollarSign, l: "MRR", v: a.mrr, c: C.coral },
            { i: TrendingUp, l: "Trend", v: a.mrrTrend, c: a.mrrTrend.startsWith("-") ? C.healthCrit : C.healthGood },
            { i: BarChart3, l: "API Calls", v: a.apiCalls, c: C.silver },
            { i: Building2, l: "Industry", v: a.industry, c: C.silver },
            { i: Users, l: "Size", v: a.employees, c: C.silver },
            { i: Target, l: "Est. ACV", v: a.acv, c: C.coral },
          ].map(({ i: Icon, l, v, c }) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon size={12} color={C.stone} />
              <div>
                <div style={{ fontFamily: sans, fontSize: 9, color: C.stone, textTransform: "uppercase", letterSpacing: .4 }}>{l}</div>
                <div style={{ fontFamily: sans, fontSize: 12, color: c, fontWeight: 500 }}>{v}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        display: "flex", gap: 2, marginBottom: 20, background: C.sand, borderRadius: 9, padding: 3,
        boxShadow: ring(C.ringW), overflowX: "auto",
      }}>
        {tabs.map(({ k, l, i: Icon }) => (
          <button key={k} onClick={() => setTab(k)} style={{
            flex: 1, fontFamily: sans, fontSize: 11.5, fontWeight: 500, padding: "7px 8px", borderRadius: 7,
            border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
            background: tab === k ? C.white : "transparent", color: tab === k ? C.nearBlack : C.stone,
            boxShadow: tab === k ? "0 1px 3px rgba(0,0,0,0.06)" : "none", transition: "all .2s",
            whiteSpace: "nowrap", minWidth: 0,
          }}>
            <Icon size={12} /> {l}
          </button>
        ))}
      </div>

      <div key={tab} style={{ animation: "fadeIn .25s ease" }}>
        {tab === "overview" && <OverviewTab a={a} />}
        {tab === "signals" && <SignalsTab a={a} />}
        {tab === "usecases" && <UseCasesTab a={a} />}
        {tab === "engagement" && <EngagementTab a={a} showToast={showToast} />}
        {tab === "outreach" && <OutreachTab a={a} showToast={showToast} />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════════ */

function ScoreRing({ label, score, color, size = 56 }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: `conic-gradient(${color} ${score * 3.6}deg, ${C.dark} 0deg)`,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 3,
      }}>
        <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: C.nearBlack, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: size * .32, fontWeight: 500, color }}>{score}</span>
        </div>
      </div>
      <span style={{ fontFamily: sans, fontSize: 9.5, fontWeight: 500, color: C.stone, textTransform: "uppercase", letterSpacing: .3, marginTop: 4, display: "block" }}>{label}</span>
    </div>
  );
}

function MiniHealthRing({ health, size = 36 }) {
  const color = healthColor(health);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `conic-gradient(${color} ${health * 3.6}deg, ${C.borderL} 0deg)`,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 2.5,
    }}>
      <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: sans, fontSize: size * .33, fontWeight: 600, color }}>{health}</span>
      </div>
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.borderL}`, boxShadow: whisper, ...style }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   OVERVIEW TAB
   ═══════════════════════════════════════════════════════════════════════════════ */

function OverviewTab({ a }) {
  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const chartData = a.usageTrend.map((v, i) => ({ month: months[i], mrr: v }));

  return (
    <div>
      <Card style={{ padding: "18px 16px", marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 500, paddingLeft: 6, marginBottom: 4 }}>MRR Trend ($K)</h3>
        <p style={{ fontFamily: sans, fontSize: 11, color: C.stone, paddingLeft: 6, marginBottom: 10 }}>Last 12 months</p>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData} margin={{ left: -10, right: 10 }}>
            <defs>
              <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.terra} stopOpacity={0.15} />
                <stop offset="100%" stopColor={C.terra} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={C.borderL} strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fill: C.stone, fontSize: 10, fontFamily: sans }} />
            <YAxis tick={{ fill: C.stone, fontSize: 10, fontFamily: sans }} tickFormatter={v => `$${v}K`} />
            <Tooltip contentStyle={{ fontFamily: sans, fontSize: 12, background: C.nearBlack, color: C.ivory, border: "none", borderRadius: 7 }} formatter={v => [`$${v}K`, "MRR"]} />
            <Area type="monotone" dataKey="mrr" stroke={C.terra} fill="url(#mrrGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { l: "Champion", v: a.champion },
          { l: "Last Touch", v: a.engagement.lastTouch },
          { l: "Current AI Stack", v: a.competitiveIntel.currentStack },
          { l: "Switching Friction", v: a.competitiveIntel.switching },
        ].map(({ l, v }) => (
          <Card key={l} style={{ padding: "14px 16px" }}>
            <div style={{ fontFamily: sans, fontSize: 10, color: C.stone, textTransform: "uppercase", letterSpacing: .4, marginBottom: 4 }}>{l}</div>
            <div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 500, color: C.nearBlack, lineHeight: 1.4 }}>{v}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SIGNALS TAB
   ═══════════════════════════════════════════════════════════════════════════════ */

function SignalsTab({ a }) {
  const radarData = Object.entries(a.signals).map(([k, v]) => ({ signal: SIGNAL_META[k].label, value: v.score, fullMark: 100 }));
  return (
    <div>
      <Card style={{ padding: "16px 12px 8px", marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 500, paddingLeft: 6, marginBottom: 4 }}>AI-Readiness Profile</h3>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="68%">
            <PolarGrid stroke={C.borderM} />
            <PolarAngleAxis dataKey="signal" tick={{ fill: C.olive, fontSize: 10, fontFamily: sans }} />
            <Radar dataKey="value" stroke={C.terra} fill={C.terra} fillOpacity={.12} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </Card>
      {Object.entries(a.signals).map(([k, v], i) => {
        const m = SIGNAL_META[k]; const Icon = m.icon;
        return (
          <Card key={k} style={{ padding: "12px 15px", marginBottom: 7, animation: `slideIn .3s ease ${i * .04}s both` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: `${m.color}11`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={14} color={m.color} />
              </div>
              <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 600, color: C.nearBlack, flex: 1 }}>{m.label}</span>
              <span style={{ fontSize: 16, fontWeight: 500, color: healthColor(v.score) }}>{v.score}</span>
            </div>
            <div style={{ height: 3, borderRadius: 2, background: C.borderL, overflow: "hidden", marginBottom: 6 }}>
              <div style={{ height: "100%", borderRadius: 2, background: m.color, width: `${v.score}%`, transition: "width .5s" }} />
            </div>
            <p style={{ fontFamily: sans, fontSize: 12, lineHeight: 1.45, color: C.olive }}>{v.detail}</p>
          </Card>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   USE CASES TAB
   ═══════════════════════════════════════════════════════════════════════════════ */

function UseCasesTab({ a }) {
  const chartData = a.useCases.map(uc => ({
    name: uc.name.length > 22 ? uc.name.slice(0, 22) + "..." : uc.name,
    value: uc.estimate, potential: uc.potential,
  }));
  return (
    <div>
      <Card style={{ padding: "16px 12px", marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 500, paddingLeft: 6, marginBottom: 2 }}>Monthly Consumption Estimate</h3>
        <p style={{ fontFamily: sans, fontSize: 11, color: C.stone, paddingLeft: 6, marginBottom: 8 }}>Projected API spend by use case</p>
        <ResponsiveContainer width="100%" height={Math.max(120, a.useCases.length * 40)}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 14 }}>
            <XAxis type="number" tick={{ fill: C.stone, fontSize: 10, fontFamily: sans }} tickFormatter={v => `$${v / 1000}K`} />
            <YAxis dataKey="name" type="category" width={110} tick={{ fill: C.olive, fontSize: 10, fontFamily: sans }} />
            <Tooltip contentStyle={{ fontFamily: sans, fontSize: 12, background: C.nearBlack, color: C.ivory, border: "none", borderRadius: 7 }} formatter={v => [`$${(v / 1000).toFixed(0)}K/mo`]} />
            <Bar dataKey="value" radius={[0, 5, 5, 0]}>
              {chartData.map((e, i) => <Cell key={i} fill={potentialColor[e.potential] || C.stone} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      {a.useCases.map((uc, i) => (
        <Card key={i} style={{ padding: "13px 16px", marginBottom: 7, animation: `slideIn .3s ease ${i * .05}s both` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{uc.name}</span>
            <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 600, color: potentialColor[uc.potential], background: `${potentialColor[uc.potential]}11`, padding: "2px 8px", borderRadius: 16 }}>{uc.potential}</span>
          </div>
          <p style={{ fontFamily: sans, fontSize: 12, lineHeight: 1.45, color: C.olive, marginBottom: 5 }}>{uc.description}</p>
          <div style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 600, color: C.terra, display: "flex", alignItems: "center", gap: 3 }}>
            <DollarSign size={12} /> {uc.consumption}
          </div>
        </Card>
      ))}
      <div style={{ marginTop: 14, background: C.nearBlack, borderRadius: 11, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: sans, fontSize: 10, color: C.stone, textTransform: "uppercase", letterSpacing: .4 }}>Estimated ACV</div>
          <div style={{ fontSize: 20, fontWeight: 500, color: C.coral, marginTop: 2 }}>{a.acv}</div>
        </div>
        <TrendingUp size={24} color={C.coral} style={{ opacity: .35 }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   ENGAGEMENT / PLAYBOOK TAB
   ═══════════════════════════════════════════════════════════════════════════════ */

function EngagementTab({ a, showToast }) {
  const pb = PLAYBOOKS[a.engagement.playbook] || PLAYBOOKS.plateau;
  const [completedSteps, setCompletedSteps] = useState([]);

  return (
    <div>
      <Card style={{ padding: "16px 18px", marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 12 }}>Engagement Status</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { l: "Last Touchpoint", v: `${a.engagement.lastTouch} (${a.engagement.touchType})` },
            { l: "Recommended Next", v: a.engagement.nextStep },
            { l: "Active Playbook", v: pb.name },
            { l: "Champion", v: a.champion },
          ].map(({ l, v }) => (
            <div key={l}>
              <div style={{ fontFamily: sans, fontSize: 10, color: C.stone, textTransform: "uppercase", letterSpacing: .4, marginBottom: 3 }}>{l}</div>
              <div style={{ fontFamily: sans, fontSize: 12.5, color: C.nearBlack, fontWeight: 500, lineHeight: 1.4 }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h3 style={{ fontSize: 16, fontWeight: 500 }}>{pb.name} Playbook</h3>
          <span style={{ fontFamily: sans, fontSize: 10.5, color: C.stone }}>{completedSteps.length}/{pb.steps.length} complete</span>
        </div>
        {pb.steps.map((step, i) => {
          const done = completedSteps.includes(i);
          return (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0",
              borderTop: i > 0 ? `1px solid ${C.borderL}` : "none",
              animation: `slideIn .3s ease ${i * .06}s both`,
            }}>
              <button onClick={() => {
                setCompletedSteps(prev => done ? prev.filter(x => x !== i) : [...prev, i]);
                if (!done) showToast(`Step ${i + 1} completed`);
              }} style={{
                width: 22, height: 22, borderRadius: 6, border: `1.5px solid ${done ? C.healthGood : C.borderM}`,
                background: done ? `${C.healthGood}15` : C.white, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1,
              }}>
                {done && <Check size={13} color={C.healthGood} />}
              </button>
              <div>
                <span style={{
                  fontFamily: sans, fontSize: 9, fontWeight: 600, color: C.stone,
                  textTransform: "uppercase", letterSpacing: .4, marginBottom: 2, display: "block",
                }}>Step {i + 1}</span>
                <span style={{
                  fontFamily: sans, fontSize: 13, color: done ? C.stone : C.nearBlack,
                  textDecoration: done ? "line-through" : "none", lineHeight: 1.4,
                }}>{step}</span>
              </div>
            </div>
          );
        })}
      </Card>

      <div style={{ marginTop: 16 }}>
        <h4 style={{ fontFamily: sans, fontSize: 11, color: C.stone, textTransform: "uppercase", letterSpacing: .5, marginBottom: 10 }}>All Playbook Templates</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {Object.entries(PLAYBOOKS).map(([k, v]) => (
            <Card key={k} style={{
              padding: "12px 14px", cursor: "default",
              border: a.engagement.playbook === k ? `1px solid ${C.terra}` : `1px solid ${C.borderL}`,
            }}>
              <div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 600, color: a.engagement.playbook === k ? C.terra : C.nearBlack, marginBottom: 4 }}>{v.name}</div>
              <div style={{ fontFamily: sans, fontSize: 11, color: C.stone }}>{v.steps.length} steps</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   OUTREACH TAB — calls /api/generate (Vercel serverless) instead of direct API
   ═══════════════════════════════════════════════════════════════════════════════ */

function OutreachTab({ a, showToast }) {
  const [copied, setCopied] = useState(null);
  const [senderName, setSenderName] = useState("Zi");
  const [editing, setEditing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [emailBody, setEmailBody] = useState(() => {
    const uc = a.useCases?.[0];
    return `Hi team,\n\nI've been following ${a.name}'s work in ${a.industry.toLowerCase()} — ${a.outreachAngles[0]?.angle.split('.')[0].toLowerCase()}.\n\n${uc ? `We're seeing teams like yours get strong results with Claude for ${uc.name.toLowerCase()}, and I think there's an opportunity to expand what you're doing.` : `I wanted to share some updates on Claude that could be relevant to your team's workflow.`}\n\nWould love to sync for 15 minutes this week. Open?\n\nBest,\n${senderName} — Anthropic`;
  });

  function handleCopy(text, idx) {
    navigator.clipboard?.writeText(text);
    setCopied(idx); showToast("Copied to clipboard");
    setTimeout(() => setCopied(null), 2000);
  }

  async function generateWithClaude() {
    setGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `You are an Emerging Account Executive at Anthropic. Write a short, warm outreach email to ${a.name} (${a.description}). Context: Health score ${a.health}/100, MRR ${a.mrr} (${a.mrrTrend} MoM), current AI stack: ${a.competitiveIntel.currentStack}. Pain point: ${a.competitiveIntel.pain}. Top use case: ${a.useCases[0]?.name}. Goal: ${a.tier === "critical" ? "retain the account and understand churn risk" : "expand usage and deepen the relationship"}. Keep it under 120 words, conversational, specific to their situation. Sign off as ${senderName} from Anthropic. No subject line, just the body.`
        }),
      });
      const data = await res.json();
      if (data.text) {
        setEmailBody(data.text);
        showToast("Email generated with Claude");
      } else {
        showToast(data.error || "Error generating email — check Vercel environment variable");
      }
    } catch (e) {
      showToast("Could not reach /api/generate — is ANTHROPIC_API_KEY set in Vercel?");
    }
    setGenerating(false);
  }

  return (
    <div>
      {a.outreachAngles.map((angle, i) => (
        <Card key={i} style={{ padding: "14px 16px", marginBottom: 8, animation: `slideIn .3s ease ${i * .06}s both` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: .4, color: C.terra, background: `${C.terra}0e`, padding: "2px 9px", borderRadius: 16 }}>{angle.type}</span>
            <button onClick={() => handleCopy(angle.angle, i)} style={{
              border: `1px solid ${C.borderM}`, background: copied === i ? `${C.terra}0e` : C.ivory,
              borderRadius: 5, padding: "2px 8px", cursor: "pointer", fontFamily: sans, fontSize: 10, fontWeight: 500,
              color: copied === i ? C.terra : C.stone, display: "flex", alignItems: "center", gap: 3,
            }}>
              {copied === i ? <Check size={10} /> : <Copy size={10} />} {copied === i ? "Copied" : "Copy"}
            </button>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.55, color: C.charcoal }}>"{angle.angle}"</p>
        </Card>
      ))}

      <Card style={{ padding: "18px 20px", marginTop: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 500 }}>Outreach Email</h3>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={generateWithClaude} disabled={generating} style={{
              border: `1px solid ${C.terra}44`, background: `${C.terra}0a`, borderRadius: 6,
              padding: "4px 10px", cursor: generating ? "wait" : "pointer", fontFamily: sans, fontSize: 11, fontWeight: 500,
              color: C.terra, display: "flex", alignItems: "center", gap: 4,
              opacity: generating ? .6 : 1,
            }}>
              <RefreshCw size={11} style={{ animation: generating ? "spin 1s linear infinite" : "none" }} />
              {generating ? "Generating..." : "Generate with Claude"}
            </button>
            <button onClick={() => setEditing(!editing)} style={{
              border: `1px solid ${C.borderM}`, background: editing ? `${C.terra}0e` : C.ivory,
              borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontFamily: sans, fontSize: 11, fontWeight: 500,
              color: editing ? C.terra : C.stone, display: "flex", alignItems: "center", gap: 4,
            }}>
              <Edit3 size={11} /> {editing ? "Done" : "Edit"}
            </button>
          </div>
        </div>

        <div style={{ background: C.parchment, borderRadius: 9, padding: "14px 16px", border: `1px solid ${C.borderL}` }}>
          <div style={{ fontFamily: sans, fontSize: 12, color: C.stone, marginBottom: 2 }}>
            <strong style={{ color: C.olive }}>From:</strong>{" "}
            {editing ? <input value={senderName} onChange={e => setSenderName(e.target.value)} style={{ border: `1px solid ${C.borderM}`, borderRadius: 4, padding: "1px 6px", fontFamily: sans, fontSize: 12, color: C.nearBlack, background: C.white, width: 100 }} /> : `${senderName} — Anthropic`}
          </div>
          <div style={{ fontFamily: sans, fontSize: 12, color: C.stone, marginBottom: 2 }}>
            <strong style={{ color: C.olive }}>To:</strong> {a.champion} @ {a.domain}
          </div>
          <div style={{ fontFamily: sans, fontSize: 12, color: C.stone, marginBottom: 10 }}>
            <strong style={{ color: C.olive }}>Subject:</strong> {a.name} + Claude — quick sync?
          </div>
          {editing ? (
            <textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} style={{
              width: "100%", minHeight: 160, border: `1px solid ${C.borderM}`, borderRadius: 6,
              padding: "10px 12px", fontFamily: serif, fontSize: 13.5, lineHeight: 1.6, color: C.charcoal,
              background: C.white, resize: "vertical",
            }} />
          ) : (
            <div style={{ fontSize: 13.5, lineHeight: 1.6, color: C.charcoal }}>
              {emailBody.split("\n\n").map((p, i) => <p key={i} style={{ marginBottom: 10 }}>{p}</p>)}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button onClick={() => handleCopy(emailBody, "email")} style={{
            flex: 1, fontFamily: sans, fontSize: 12, fontWeight: 500, padding: "9px 0", borderRadius: 8,
            border: `1px solid ${C.borderM}`, background: C.white, color: C.charcoal, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
          }}>
            <Copy size={12} /> Copy Email
          </button>
          <button onClick={() => showToast("Added to HubSpot sequence (demo)")} style={{
            flex: 1, fontFamily: sans, fontSize: 12, fontWeight: 500, padding: "9px 0", borderRadius: 8,
            border: "none", background: C.terra, color: C.ivory, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5, position: "relative",
          }}>
            <Send size={12} /> Add to Sequence
            <span style={{
              position: "absolute", top: -7, right: -5, fontFamily: sans, fontSize: 8.5, fontWeight: 600,
              background: C.nearBlack, color: C.ivory, padding: "1px 5px", borderRadius: 7,
              letterSpacing: .2, textTransform: "uppercase",
            }}>Demo</span>
          </button>
        </div>
      </Card>

      <button onClick={() => showToast("Account brief generated — ready to share")} style={{
        marginTop: 14, width: "100%", fontFamily: sans, fontSize: 12.5, fontWeight: 500,
        padding: "11px 0", borderRadius: 9, border: `1px solid ${C.borderM}`,
        background: C.white, color: C.charcoal, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
      }}>
        <Printer size={14} /> Generate Account Brief
      </button>
    </div>
  );
}
