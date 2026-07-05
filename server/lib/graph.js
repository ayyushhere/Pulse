// COMPONENT: the graph
//
// This is where the individual nodes become a pipeline. StateGraph takes
// the state shape we defined, then we register each node and connect them
// with edges. "START" and "END" are LangGraph's built-in markers for the
// entry and exit points.
//
// The interesting part is the fan-out/fan-in: both analyzeFinancials and
// analyzeMarketPosition are added as edges FROM the same node (gatherData),
// so LangGraph runs them concurrently. Both then have an edge TO the same
// next node (decideVerdict), which only runs once both are done.

import { StateGraph, START, END } from "@langchain/langgraph";
import { AgentState } from "./state.js";
import { resolveCompany } from "./nodes/resolveCompany.js";
import { gatherData } from "./nodes/gatherData.js";
import { analyzeFinancials } from "./nodes/analyzeFinancials.js";
import { analyzeMarketPosition } from "./nodes/analyzeMarketPosition.js";
import { decideVerdict } from "./nodes/decideVerdict.js";

const graph = new StateGraph(AgentState)
  .addNode("resolveCompany", resolveCompany)
  .addNode("gatherData", gatherData)
  .addNode("analyzeFinancials", analyzeFinancials)
  .addNode("analyzeMarketPosition", analyzeMarketPosition)
  .addNode("decideVerdict", decideVerdict)

  .addEdge(START, "resolveCompany")
  .addEdge("resolveCompany", "gatherData")

  // fan-out: both run off of gatherData
  .addEdge("gatherData", "analyzeFinancials")
  .addEdge("gatherData", "analyzeMarketPosition")

  // fan-in: decideVerdict waits for both
  .addEdge("analyzeFinancials", "decideVerdict")
  .addEdge("analyzeMarketPosition", "decideVerdict")

  .addEdge("decideVerdict", END);

export const investmentAgent = graph.compile();

// Quick manual test: `node server/lib/graph.js "Tesla"`
if (import.meta.url === `file://${process.argv[1]}`) {
  const { default: dotenv } = await import("dotenv");
  dotenv.config();

  const companyName = process.argv[2] || "Tesla";
  console.log(`\nRunning full agent for: ${companyName}...\n`);

  const result = await investmentAgent.invoke({ companyName });
  console.log(JSON.stringify(result, null, 2));
}
