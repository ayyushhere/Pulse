// NODE: decideVerdict
//
// The fan-in point: both analysis nodes have finished by the time this runs,
// so their outputs are both sitting in state. This node's only job is to
// weigh them and commit to a verdict - it doesn't do any new research.

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { model } from "../model.js";

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are an investment decision-maker. Based on the financial and market " +
      "analysis below, decide INVEST or PASS. Respond with ONLY valid JSON, " +
      "no markdown fences, using this exact structure. ALL financial figures and stock prices MUST be in US Dollars ($): " +
      '{{"verdict": "INVEST or PASS", "confidence": 0-100, ' +
      '"price": "$150.00", "priceChange": "+1.5%", ' +
      '"reasoning": ["bullet 1", "bullet 2", "bullet 3"], ' +
      '"criticalUpdates": [{{"time": "2 HOURS AGO", "text": "Recent news item"}}], ' +
      '"metrics": [{{"name": "P/E Ratio", "val": "30x", "avg": "25x", "var": "+20%", "pos": false}}]}}',
  ],
  [
    "human",
    "Company: {companyName}\n\nFinancial analysis:\n{financialAnalysis}\n\n" +
      "Market analysis:\n{marketAnalysis}",
  ],
]);

const chain = prompt.pipe(model).pipe(new StringOutputParser());

export async function decideVerdict(state) {
  const raw = await chain.invoke({
    companyName: state.companyName,
    financialAnalysis: state.financialAnalysis,
    marketAnalysis: state.marketAnalysis,
  });

  const decision = JSON.parse(raw.trim());

  return { decision };
}
