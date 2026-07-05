import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import pkg from "@prisma/client";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { investmentAgent } from "./lib/graph.js";

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Pulse server running on http://localhost:${PORT}`);
  // Force restart to load new Prisma client
});
