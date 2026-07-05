# Pulse - AI Investment Research Agent

## Overview - What it does
Pulse is a full-stack AI-powered investment research platform. It takes a company ticker or name, performs deep-dive fundamental and sentiment research, and provides a decisive **Invest or Pass** verdict. 

The application utilizes a proprietary agentic workflow to gather real-time financial data, analyze global news sentiment, and synthesize the information into a professional, institutional-grade research report. The results are cached and persisted, allowing for instant retrieval of historical research via the user dashboard.

## How to run it - Setup and run steps

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- API Keys:
  - `OPENAI_API_KEY` (for LangGraph/LLM)
  - `TAVILY_API_KEY` (for web search/news gathering)
  - `FMP_API_KEY` (Financial Modeling Prep API for real-time financial data)
  - Clerk API keys (for authentication)

### 1. Clone & Install Dependencies
You will need two terminals running concurrently (one for the frontend, one for the backend).

**Backend (Server)**
```bash
cd server
npm install
```

**Frontend (Client)**
```bash
cd client
npm install
```

### 2. Environment Variables
Create a `.env` file in the `server` directory:
```env
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/investiq?schema=public"
OPENAI_API_KEY="your_openai_api_key"
TAVILY_API_KEY="your_tavily_api_key"
FMP_API_KEY="your_fmp_api_key"
CLERK_PUBLISHABLE_KEY="your_clerk_pub_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
```

Create a `.env` file in the `client` directory:
```env
VITE_CLERK_PUBLISHABLE_KEY="your_clerk_pub_key"
```

### 3. Database Setup
Ensure your PostgreSQL instance is running.
```bash
cd server
npx prisma db push
npx prisma generate
```

### 4. Run the Application
Start the backend server:
```bash
cd server
npm run dev
```

Start the frontend client:
```bash
cd client
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

## How it works - Approach and architecture

### Architecture
- **Frontend:** React (Vite), TailwindCSS, Lucide React (Icons), React Router.
- **Backend:** Node.js, Express.js.
- **Database:** PostgreSQL managed by Prisma ORM.
- **Authentication:** Clerk (integrated on both client and server via `@clerk/clerk-react` and `@clerk/express`).
- **AI Engine:** `LangGraph.js` and `LangChain.js` utilizing OpenAI's `gpt-4o`.

### The AI Workflow (LangGraph)
The core of the application is an agentic workflow defined in LangGraph (`investmentAgent.js`). It operates as a state machine with the following nodes:
1. **`gatherFinancials`**: Calls the Financial Modeling Prep (FMP) API to fetch real-time income statements, balance sheets, and key metrics.
2. **`gatherNews`**: Uses the Tavily Search API to scrape recent news articles and market sentiment regarding the target company.
3. **`analyzeFinancials`**: An LLM node that processes the raw financial data to evaluate growth, profitability, and financial health.
4. **`analyzeMarket`**: An LLM node that processes the news context to determine market sentiment, regulatory risks, and tailwinds.
5. **`decideVerdict`**: The final LLM synthesizer node that takes both analyses, weighs the pros and cons, and issues a final **INVEST** or **PASS** verdict with detailed reasoning, denominated in INR (₹).

### Data Flow
- The React client streams the LangGraph execution via Server-Sent Events (SSE). This allows the UI to show real-time animated loading steps ("Scanning Global News...", "Performing Deep Financial Analysis...").
- Upon completion, the backend saves the entire JSON state of the AI graph to PostgreSQL, linked to the user's Clerk ID.
- The user can instantly revisit past research in the "History" tab without re-triggering the expensive AI pipeline.

## Key decisions & trade-offs

1. **LangGraph vs. Standard LLM Chain:** 
   - *Decision:* Used LangGraph for explicit state management and deterministic routing.
   - *Why:* Financial research requires a rigid, multi-step process (Data gathering -> Individual Analysis -> Final Synthesis). Standard LLM agents (like ReAct) can hallucinate API calls or skip steps. LangGraph ensures data is strictly gathered before analysis begins.
2. **Streaming Execution (SSE):** 
   - *Decision:* Implemented Server-Sent Events for the research endpoint.
   - *Why:* AI research takes 15-30 seconds. A standard HTTP request would cause browser timeouts and poor UX. SSE provides real-time state updates to the UI.
3. **Database Snapshotting:** 
   - *Decision:* Storing the entire LangGraph state object in a `JSON` column in Postgres.
   - *Why:* Relational mapping of complex AI outputs is fragile. Saving the JSON snapshot allows the frontend to flawlessly render historical results exactly as they appeared when generated.
4. **Trade-off - Extensibility vs Scope:** 
   - Due to the 7-day limit, I opted for a predefined graph structure rather than a dynamic agent that writes its own queries. This guarantees reliability and format consistency at the cost of the agent's absolute autonomy.

## Example runs

*Note: Live results will vary based on current market conditions when the agent runs.*

1. **NVIDIA (NVDA)**
   - **Verdict:** INVEST
   - **Reasoning:** Sustained hyper-growth in data center revenue driven by AI chip demand. Exceptionally high gross margins. Despite high valuation multiples, the monopoly-like moat in GPU accelerators justifies the premium.
2. **GameStop (GME)**
   - **Verdict:** PASS
   - **Reasoning:** Declining core software revenues. Business relies heavily on meme-stock capital raises rather than fundamental cash flow generation. High volatility and disconnected valuation.
3. **Tata Motors (TATAMOTORS.NS)**
   - **Verdict:** INVEST
   - **Reasoning:** Strong turnaround in JLR operations. Dominant market share in India's EV transition. Improving debt profile and robust cash flows.

## What you would improve with more time
1. **Multi-Agent Debate:** Implement two separate LangGraph agents (a "Bull" and a "Bear") that debate the stock before the final verdict node synthesizes their arguments.
2. **Technical Analysis Integration:** Add a node that fetches historical price data to calculate moving averages and RSI to time the entry point better.
3. **PDF Export:** Allow users to download the finalized research report as a styled PDF.
4. **WebSockets instead of SSE:** Upgrade to full WebSockets for bi-directional communication, allowing the user to "interrupt" or steer the agent mid-research.

## Bonus: LLM Chat Transcript
The AI pair-programming transcript for this project's development is included in the submission bundle, demonstrating the iterative architecture and debugging process.
