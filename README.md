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

## 📖 Overview — what it does

**Pulse** is a full-stack, AI-powered investment research platform designed to mimic the workflow of a professional hedge fund analyst. Give it a company ticker (e.g., `NVDA`, `AAPL`) and Pulse performs a deep-dive fundamental analysis, reads the latest global news, and provides a decisive **Invest or Pass** verdict.

### Key Features
- **Live Market Ticker:** Real-time data streaming across the dashboard (powered by Finnhub).
- **Agentic AI Workflow:** Autonomous research gathering using Google Gemini & LangChain.
- **Real-time Web Search:** Integration with Tavily API for up-to-the-minute news scraping.
- **Secure Authentication:** User identity and session management via Clerk.
- **Historical Portfolio:** Instant retrieval of past research cached in a Neon PostgreSQL database.
- **Server-Sent Events (SSE):** Streaming AI thought processes directly to the UI.
- **Interactive AI Chatbot:** Users can chat with the AI about the generated research report directly within the dashboard.

---

## 🛠️ How to run it — setup and run steps

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database URL (e.g., Neon or local)
- Free API Keys:
  - `GOOGLE_API_KEY` (Gemini LLM)
  - `TAVILY_API_KEY` (Web Search)
  - `FINNHUB_API_KEY` (Live Ticker Data)
  - `CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY` (Authentication)
  - `LANGSMITH_API_KEY` (Node Tracing & Evaluation)

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

### 2. Environment Variables (.env setup)
For security, the `.env` files have been omitted from this submission. You must create them in your local clone.

**Create a `.env` in the `server` directory:**
```env
PORT=3001
DATABASE_URL="postgresql://user:password@your_neon_db_url/postgres?sslmode=require"
GOOGLE_API_KEY="your_gemini_api_key"
TAVILY_API_KEY="your_tavily_api_key"
FINNHUB_API_KEY="your_finnhub_api_key"
CLERK_PUBLISHABLE_KEY="your_clerk_pub_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
LANGSMITH_TRACING=true
LANGSMITH_ENDPOINT="https://api.smith.langchain.com"
LANGSMITH_API_KEY="your_langsmith_api_key"
LANGSMITH_PROJECT="pulse-agent"
```

**Create a `.env` in the `client` directory:**
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

## 🧠 How it works — your approach and architecture

The core of the application utilizes an **agentic workflow** powered by **LangGraph** on the backend. Rather than relying on a single, unpredictable LLM call, Pulse operates as a deterministic state machine:

1. **`resolveCompany`**: An initial LLM node that takes a casual user input (like "apple" or "elon musk car company") and maps it to a canonical ticker symbol (`AAPL`, `TSLA`).
2. **`gatherFinancials`**: A deterministic function that hits external APIs to fetch quantitative financial data.
3. **`gatherNews`**: Uses the Tavily API to scrape the web for the latest, up-to-the-minute articles about the company.
4. **`analyzeFinancials`**: An LLM node that processes the raw financial data to evaluate growth, health, and valuation.
5. **`analyzeMarket`**: An LLM node that processes the news to determine sentiment, regulatory risks, and macro tailwinds.
6. **`decideVerdict`**: The final synthesizer node. It acts as the "Portfolio Manager", weighing all inputs from the analyst nodes and issuing a final **INVEST** or **PASS** verdict with a structured JSON response.

The backend uses **Server-Sent Events (SSE)** to stream the status of each LangGraph node directly to the React frontend, providing the user with a live "thought process" terminal UI.

---

## ⚖️ Key decisions & trade-offs — what you chose and why, and what you left out

- **LangGraph vs. ReAct Agents:** I chose LangGraph over standard autonomous agents (like ReAct). Financial research requires a strict, multi-step process. ReAct agents frequently hallucinate API calls or skip critical research steps if confused. LangGraph ensures data is strictly gathered *before* analysis begins.
- **Clerk vs. Custom JWT Auth:** I chose Clerk for authentication instead of building a custom JWT solution. This saved massive development time and provides enterprise-grade security, allowing me to focus entirely on the AI agent logic.
- **Server-Sent Events (SSE) vs. WebSockets:** I used SSE for streaming the agent's thought process to the frontend. WebSockets are bidirectional and overkill for this specific feature. SSE is simpler, natively supported over standard HTTP, and perfect for one-way server-to-client streaming.
- **Neon PostgreSQL & Prisma:** I opted for Neon Serverless Postgres managed via Prisma ORM. Neon's scale-to-zero capabilities make it extremely cost-effective for side projects, and Prisma's typed schemas prevented database bugs during rapid prototyping.
- **What I left out:** I initially planned to integrate a payment gateway (Stripe) to monetize the app and limit free users to 5 searches. I omitted this due to time constraints, focusing instead on perfecting the LangGraph AI pipeline.

---

## 🎯 Example runs — your agent’s output on a few companies of your choice

### Example 1: NVIDIA (NVDA)
**Agent Input:** "nvidia"
**Verdict:** `INVEST` (Confidence: 85%)
**Agent Output (DecideVerdict Node JSON Extract):**
```json
{
  "verdict": "INVEST",
  "confidence": 85,
  "price": "$125.00",
  "priceChange": "+2.4%",
  "reasoning": [
    "Unprecedented demand for Hopper and upcoming Blackwell GPUs secures monopolistic data center revenue.",
    "Gross margins remain historically high at 75%+, showcasing immense pricing power.",
    "Hyperscalers (Microsoft, Meta, Google) have committed billions to future AI capex, directly benefiting NVDA."
  ],
  "metrics": [
    {"name": "P/E Ratio", "desc": "Valuation multiple", "val": "45x", "avg": "30x", "var": "+50%", "pos": false},
    {"name": "Revenue Growth", "desc": "YoY Sales increase", "val": "260%", "avg": "15%", "var": "+245%", "pos": true}
  ]
}
```

### Example 2: Tesla (TSLA)
**Agent Input:** "tesla"
**Verdict:** `PASS` (Confidence: 65%)
**Agent Output (DecideVerdict Node JSON Extract):**
```json
{
  "verdict": "PASS",
  "confidence": 65,
  "price": "$175.00",
  "priceChange": "-1.2%",
  "reasoning": [
    "Intense price wars in China and globally are compressing automotive gross margins significantly.",
    "Macroeconomic headwinds and high interest rates are dampening consumer demand for premium EVs.",
    "While FSD and Robotaxi present long-term upside, the near-term financial picture is heavily pressured."
  ],
  "metrics": [
    {"name": "Gross Margin", "desc": "Profitability after direct costs", "val": "17.4%", "avg": "20%", "var": "-2.6%", "pos": false},
    {"name": "YoY Deliveries", "desc": "Vehicle volume growth", "val": "-8%", "avg": "+5%", "var": "-13%", "pos": false}
  ]
}
```

---

## 🚀 What you would improve with more time

- **Multi-Agent Debate (Mixture of Experts):** I would implement a "Bull" and "Bear" agent that debate the stock's merits before the final verdict node synthesizes their arguments. This mimics real hedge fund investment committees.
- **Advanced Technical Analysis:** Currently, the app focuses purely on fundamentals and news sentiment. I would integrate moving averages (SMA/EMA) and RSI calculations to help the AI time entry points better.
- **Stripe Monetization:** Implement Stripe Checkout and Webhooks to enforce a paywall (e.g., capping free users to 5 searches per month).
- **PDF Report Export:** Allow users to download the finalized, styled research reports as PDFs for offline reading or sharing.

---

<div align="center">
  <p>Built with ❤️ using React, LangGraph, and Gemini.</p>
</div>
