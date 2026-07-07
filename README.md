<div align="center">
  <img src="./client/public/demo.gif" alt="Pulse AI Demo" width="600" />
  <h1>Pulse: AI Investment Researcher</h1>
  <p><strong>Institutional-grade AI financial analysis in seconds.</strong></p>

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
</div>

<br />

🚀 **Live Demo:** [https://pulse-aie.vercel.app/](https://pulse-aie.vercel.app/)

---

## 📖 Overview

**Pulse** is a full-stack, AI-powered investment research platform designed to mimic the workflow of a professional hedge fund analyst. Give it a company ticker (e.g., `NVDA`, `AAPL`) and Pulse performs a deep-dive fundamental analysis, reads the latest global news, and provides a decisive **Invest or Pass** verdict.

The application utilizes a proprietary **agentic workflow** powered by LangGraph, enabling the AI to autonomously gather real-time financial data, gauge market sentiment, and synthesize a comprehensive report.

---

## ✨ Features

- **Live Market Ticker:** Real-time data streaming across the dashboard (powered by Finnhub).
- **Agentic AI Workflow:** Autonomous research gathering using Google Gemini & LangChain.
- **Real-time Web Search:** Integration with Tavily API for up-to-the-minute news scraping.
- **Secure Authentication:** User identity and session management via Clerk.
- **Historical Portfolio:** Instant retrieval of past research cached in a Neon PostgreSQL database.
- **Server-Sent Events (SSE):** Streaming AI thought processes directly to the UI.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React (Vite)
- **Styling:** TailwindCSS, Glassmorphism UI
- **Icons:** Lucide React
- **Routing:** React Router DOM

### Backend
- **Runtime:** Node.js, Express.js
- **Database:** PostgreSQL (Neon) managed by Prisma ORM
- **Authentication:** Clerk (`@clerk/express`)
- **AI Engine:** LangGraph.js, LangChain.js, Google Gemini (`gpt-4o` / `gemini-1.5-pro`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database URL (e.g., Neon or local)
- Free API Keys:
  - `GOOGLE_API_KEY` (Gemini LLM)
  - `TAVILY_API_KEY` (Web Search)
  - `FINNHUB_API_KEY` (Live Ticker Data)
  - `CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY` (Authentication)

### 1. Clone & Install
You will need two terminals running concurrently (one for the frontend, one for the backend).

```bash
# Terminal 1: Backend
cd server
npm install

# Terminal 2: Frontend
cd client
npm install
```

### 2. Environment Variables

Create a `.env` in the `server` directory:
```env
PORT=3001
DATABASE_URL="postgresql://user:password@localhost:5432/investiq?schema=public"
GOOGLE_API_KEY="your_gemini_api_key"
TAVILY_API_KEY="your_tavily_api_key"
FINNHUB_API_KEY="your_finnhub_api_key"
CLERK_PUBLISHABLE_KEY="your_clerk_pub_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
```

Create a `.env` in the `client` directory:
```env
VITE_API_URL="http://localhost:3001"
VITE_CLERK_PUBLISHABLE_KEY="your_clerk_pub_key"
```

### 3. Database Initialization
```bash
cd server
npx prisma db push
npx prisma generate
```

### 4. Run the Application
```bash
# Terminal 1
cd server
npm run dev

# Terminal 2
cd client
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

---

## 🧠 How The AI Works (LangGraph)

The core of the application is an agentic workflow defined in LangGraph (`investmentAgent.js`). It operates as a state machine:

1. **`gatherFinancials`**: Fetches quantitative data.
2. **`gatherNews`**: Uses Tavily API to scrape recent articles and determine market sentiment.
3. **`analyzeFinancials`**: An LLM node that processes the raw financial data to evaluate growth and health.
4. **`analyzeMarket`**: An LLM node that processes the news to determine sentiment, regulatory risks, and tailwinds.
5. **`decideVerdict`**: The final synthesizer node that weighs all inputs and issues a final **INVEST** or **PASS** verdict with detailed reasoning.

### Why LangGraph?
Financial research requires a strict, multi-step process. Standard autonomous LLM agents (like ReAct) can hallucinate API calls or skip critical research steps. LangGraph ensures data is strictly gathered *before* analysis begins.

---

## 📈 Future Roadmap

- [ ] **Multi-Agent Debate:** Implement a "Bull" and "Bear" agent that debate the stock before the final verdict node synthesizes their arguments.
- [ ] **Technical Analysis:** Fetch historical price data to calculate moving averages (SMA/EMA) and RSI to time entry points.
- [ ] **PDF Export:** Allow users to download finalized research reports as styled PDFs.
- [ ] **Follow-up Chatbot:** Upgrade to WebSockets for bi-directional communication, allowing users to ask follow-up questions about the generated report.

---

<div align="center">
  <p>Built with ❤️ using React, LangGraph, and Gemini.</p>
</div>
