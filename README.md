# ClaudAE

Portfolio intelligence dashboard for Emerging Account Executives at Anthropic. Built by Zi Pan.

## What it does

ClaudAE helps AEs manage 40-50+ startup accounts by combining account health scoring, breakout detection, churn risk alerts, and AI-powered engagement recommendations — with Claude's API integrated directly for personalized outreach generation.

**Daily Briefing** — Prioritized queue of accounts needing attention today, with triggers and recommended actions.

**Portfolio Heatmap** — Visual grid of all accounts color-coded by health and breakout probability.

**Account Detail** — Deep intelligence with signals, use cases, competitive intel, playbook templates, and Claude-powered email generation.

## Run locally

```bash
npm install
npm run dev
```

## Claude API integration

Open Settings (gear icon) and paste your Anthropic API key. The "Generate with Claude" button in the Outreach tab will call `claude-sonnet-4-6` to generate personalized emails based on account context. Without a key, pre-written templates are used.

## Tech stack

React + Vite + Recharts + Lucide Icons. Single-page app with no external CSS dependencies.
