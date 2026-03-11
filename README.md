# 🐇 Talking Rabbitt — Conversational Analytics MVP

> **"Own your Data, Own your AI"** — Replace 10-minute Excel filters with 5-second conversations.

**Live Demo:** [VERCEL_URL]

---

## 🚀 What It Does

Talking Rabbitt is a conversational analytics prototype that lets users **talk to their data** in real-time:

1. **📊 Upload** — Drop any standard sales/analytics CSV file
2. **💬 Ask** — Type a natural language question (e.g., "Which region had the highest revenue?")
3. **📈 Answer** — Get an instant text answer + auto-generated bar chart

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Styling** | Tailwind CSS |
| **Charts** | Recharts |
| **LLM** | Groq SDK — LLaMA 3.3-70b-versatile |
| **CSV Parsing** | PapaParse (client-side) |
| **Deployment** | Vercel |

## ⚡ Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/talkingrabbit.git
cd talkingrabbit

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Add your Groq API key to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `GROQ_API_KEY` | Your Groq API key ([console.groq.com](https://console.groq.com)) |

## 📐 Architecture

```
src/app/
├── api/query/route.js   # Server-side LLM endpoint (Groq + LLaMA 3.3)
├── layout.js            # Root layout — dark theme, IBM Plex Mono font
├── page.js              # Full UI — upload, chat, chart, history
└── globals.css          # Tailwind config + custom styles
```

**Key Design Decisions:**
- **Server-side API route** — API key never exposed to the client
- **Client-side CSV parsing** — Fast, no upload latency, data stays in browser
- **Single-page architecture** — Zero routing complexity, maximum demo impact
- **LLaMA 3.3-70b** via Groq — Fast inference (~300ms), accurate data analysis

## 🎯 The "Magic Moment"

The core product thesis: enterprise leaders shouldn't need SQL skills or 10-minute Excel filter sessions to get answers from their data. Talking Rabbitt proves this in one interaction:

> **Upload CSV → Ask "Which region had the highest revenue?" → Get answer + chart in 5 seconds**

## 📊 Sample CSV

Download a test CSV from [Kaggle Sales Forecasting](https://www.kaggle.com/datasets/rohitsahoo/sales-forecasting).

---

## Built For

**Rabbitt AI — Product Manager Challenge**

Rabbitt AI is an enterprise AI company specializing in private cloud LLM deployments, data annotation, and conversational AI agents. Backed by NVIDIA, Meta, and Microsoft executives with $2.1M seed funding and 70+ enterprise clients.

---

*Built with ❤️ for the Talking Rabbitt challenge*
