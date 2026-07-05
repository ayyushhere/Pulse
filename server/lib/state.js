// COMPONENT: shared state
//
// Every node in the graph reads from and writes to this one shared object.
// Think of it as the "form" that gets filled in a little more at each step:
// resolveCompany fills in `ticker`, gatherData fills in `researchData`, and
// so on. By the time it reaches decideVerdict, everything it needs is
// already sitting in the state.
//
// Annotation.Root() is LangGraph's way of declaring the shape of that object
// up front, so every node knows exactly what fields exist.

import { Annotation } from "@langchain/langgraph";

export const AgentState = Annotation.Root({
  // input
  companyName: Annotation(),

  // filled in by resolveCompany
  ticker: Annotation(),
  sector: Annotation(),

  // filled in by gatherData
  researchData: Annotation(),

  // filled in by the two parallel analysis nodes
  financialAnalysis: Annotation(),
  marketAnalysis: Annotation(),

  // filled in by decideVerdict - the final output
  decision: Annotation(),
});
