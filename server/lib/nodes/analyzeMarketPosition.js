// NODE: analyzeMarketPosition
//
// Sibling of analyzeFinancials - same shape, different lens on the same
// researchData.

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { model } from "../model.js";

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a market analyst. Based on the research below, summarize in 3-4 " +
      "sentences: competitive position, recent news sentiment, and key risks " +
      "(regulatory, competitive, or operational).",
  ],
  ["human", "Research data:\n{news}"],
]);

const chain = prompt.pipe(model).pipe(new StringOutputParser());

export async function analyzeMarketPosition(state) {
  const summary = await chain.invoke({
    news: JSON.stringify(state.researchData.news),
  });

  return { marketAnalysis: summary };
}
