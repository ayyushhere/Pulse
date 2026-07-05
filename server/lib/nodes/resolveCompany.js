// NODE: resolveCompany
//
// Every node follows the same shape: it's a function that takes the current
// state, does some work, and returns a partial object with just the fields
// it's updating. LangGraph merges that partial object back into the state.
//
// This node's job: turn a loose company name ("apple", "Tesla Inc") into a
// clean ticker + sector, so later nodes have something precise to search for.

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { model } from "../model.js";

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You identify companies from casual names. Respond with ONLY valid JSON, " +
      'no markdown fences: {{"ticker": "...", "sector": "...", "fullName": "..."}}. ' +
      "If genuinely ambiguous, pick the most well-known public company that fits.",
  ],
  ["human", "{companyName}"],
]);

const chain = prompt.pipe(model).pipe(new StringOutputParser());

export async function resolveCompany(state) {
  const raw = await chain.invoke({ companyName: state.companyName });
  const parsed = JSON.parse(raw.trim());

  return {
    ticker: parsed.ticker,
    sector: parsed.sector,
  };
}
