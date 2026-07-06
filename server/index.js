import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import pkg from "@prisma/client";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { investmentAgent } from "./lib/graph.js";
import { model } from "./lib/model.js";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

const { PrismaClient } = pkg;
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const app = express();
const prisma = new PrismaClient({ adapter });

app.use(cors({
  origin: (origin, callback) => {
    callback(null, true); // Allow all origins for easy deployment
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());
app.use(clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
  clockSkewInMs: 15 * 60 * 1000
}));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/research", async (req, res) => {
  const logMsg = `\n[POST /api/research] Received request\n` +
                 `Authorization header: ${req.headers.authorization ? "Present" : "Missing"}\n` +
                 `Header value: ${req.headers.authorization}\n` +
                 `Company: ${req.body.company}, UserId: ${req.auth?.userId}\n`;
  console.log(logMsg);
  import("fs").then(fs => fs.appendFileSync("debug.log", logMsg));
  
  let userId = null;
  const tokenStr = req.headers.authorization?.replace('Bearer ', '');
  if (tokenStr) {
    try {
      const { verifyToken } = await import("@clerk/express");
      const payload = await verifyToken(tokenStr, { 
        secretKey: process.env.CLERK_SECRET_KEY, 
        clockSkewInMs: 15 * 60 * 1000 
      });
      userId = payload.sub;
    } catch (err) {
      console.error("Token verification failed:", err.message);
    }
  }

  const { company } = req.body;

  if (!userId) {
    console.error(`[POST /api/research] Rejecting with 401 Unauthorized.`);
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!company || typeof company !== "string") {
    console.error(`[POST /api/research] Rejecting with 400 Missing Company`);
    return res.status(400).json({ error: "Missing 'company' in request body" });
  }

  // Set up Server-Sent Events (SSE)
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const stream = await investmentAgent.stream(
      { companyName: company },
      { streamMode: "values" }
    );

    let finalState = null;

    for await (const state of stream) {
      finalState = state;
      // Send the current state as a progress update
      res.write(`data: ${JSON.stringify({ type: 'progress', state })}\n\n`);
    }

    if (finalState && finalState.decision) {
      // Save the final result to Postgres via Prisma
      try {
        await prisma.searchHistory.create({
          data: {
            userId,
            companyName: finalState.companyName || company,
            ticker: finalState.ticker,
            sector: finalState.sector,
            verdict: finalState.decision.verdict,
            confidence: finalState.decision.confidence,
            reasoning: finalState.decision.reasoning || [],
            fullData: finalState,
          }
        });
      } catch (dbError) {
        console.error("Failed to save to database:", dbError);
        // We don't fail the request if DB save fails, just log it.
      }
      
      // Send the final completion event
      res.write(`data: ${JSON.stringify({ type: 'complete', state: finalState })}\n\n`);
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', message: "Agent finished without a decision." })}\n\n`);
    }
  } catch (err) {
    console.error(err);
    res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
  } finally {
    res.end();
  }
});

app.get("/api/history", async (req, res) => {
  let userId = null;
  const tokenStr = req.headers.authorization?.replace('Bearer ', '');
  if (tokenStr) {
    try {
      const { verifyToken } = await import("@clerk/express");
      const payload = await verifyToken(tokenStr, { 
        secretKey: process.env.CLERK_SECRET_KEY, 
        clockSkewInMs: 15 * 60 * 1000 
      });
      userId = payload.sub;
    } catch (err) {
      console.error("Token verification failed:", err.message);
    }
  }

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const history = await prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(history);
  } catch (error) {
    console.error("Failed to fetch history:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

app.post("/api/chat", async (req, res) => {
  let userId = null;
  const tokenStr = req.headers.authorization?.replace('Bearer ', '');
  if (tokenStr) {
    try {
      const { verifyToken } = await import("@clerk/express");
      const payload = await verifyToken(tokenStr, { 
        secretKey: process.env.CLERK_SECRET_KEY, 
        clockSkewInMs: 15 * 60 * 1000 
      });
      userId = payload.sub;
    } catch (err) {
      console.error("Token verification failed:", err.message);
    }
  }

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing or invalid 'messages' array" });
  }

  try {
    const systemPrompt = new SystemMessage(
      "You are Pulse, an elite AI Investment Researcher and financial analyst. " +
      "Provide concise, institutional-grade insights. Be sharp, analytical, and highly knowledgeable about stock markets, macroeconomics, and finance."
    );

    // Convert frontend messages to LangChain message objects
    const formattedMessages = messages.map(msg => {
      if (msg.role === 'user') return new HumanMessage(msg.content);
      if (msg.role === 'assistant') return new AIMessage(msg.content);
      return new HumanMessage(msg.content);
    });

    const response = await model.invoke([systemPrompt, ...formattedMessages]);
    
    res.json({ reply: response.content });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Failed to process chat request" });
  }
});

app.get("/api/ticker", async (req, res) => {
  try {
    const API_KEY = process.env.FINNHUB_API_KEY;
    if (!API_KEY) {
      throw new Error("Finnhub API key is not configured");
    }

    // Since Finnhub free tier doesn't support indices easily, we use ETF proxies + popular stocks
    const symbols = [
      { id: 'SPY', name: 'S&P 500' },
      { id: 'QQQ', name: 'NASDAQ' },
      { id: 'DIA', name: 'DOW' },
      { id: 'NVDA', name: 'NVDA' },
      { id: 'AAPL', name: 'AAPL' },
      { id: 'MSFT', name: 'MSFT' },
      { id: 'TSLA', name: 'TSLA' },
      { id: 'BTC-USD', name: 'BTC' }
    ];
    
    // Fetch quotes in parallel
    const quotes = await Promise.all(
      symbols.map(async (sym) => {
        try {
          const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${sym.id}&token=${API_KEY}`);
          if (!response.ok) throw new Error("Fetch failed");
          const data = await response.json();
          // Finnhub quote format: c (current), d (change), dp (percent change)
          return { symbol: sym.name, data };
        } catch (e) {
          console.error(`Error fetching quote for ${sym.id}:`, e.message);
          return null;
        }
      })
    );

    const formattedData = quotes
      .filter(q => q !== null && q.data && q.data.c)
      .map(q => {
        const { c: currentPrice, dp: changePct } = q.data;
        
        let priceStr = '';
        if (q.symbol === 'BTC') {
           priceStr = `$${currentPrice.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
        } else {
           priceStr = `$${currentPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        }

        const changeStr = `${changePct > 0 ? '+' : ''}${changePct.toFixed(2)}%`;

        return {
          symbol: q.symbol,
          price: priceStr,
          change: changeStr,
          up: changePct >= 0
        };
      });

    res.json(formattedData);
  } catch (err) {
    console.error("Ticker fetch error:", err);
    res.status(500).json({ error: "Failed to fetch ticker data" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Pulse server running on http://localhost:${PORT}`);
  // Force restart to load new Prisma client
});
