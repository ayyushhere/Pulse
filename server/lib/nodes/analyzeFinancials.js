// NODE: analyzeFinancials
//
// This runs in parallel with analyzeMarketPosition (see graph.js) - both read
// from `researchData` but write to different state fields, so there's no
// conflict merging their results back together.

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { model } from "../model.js";

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a financial analyst. Based on the research below, summarize the " +
      "company's financial health in 3-4 sentences: revenue trend, profitability, " +
      "and any red flags. Be specific about numbers where they appear.",
  ],
  ["human", "Research data:\n{financials}"],
]);

const chain = prompt.pipe(model).pipe(new StringOutputParser());

export async function analyzeFinancials(state) {
  const summary = await chain.invoke({
    financials: JSON.stringify(state.researchData.financials),
  });

  return { financialAnalysis: summary };
}
