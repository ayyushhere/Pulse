// DAY 1 LESSON: what is a "chain" in LangChain?
//
// A chain is just: PROMPT -> MODEL -> PARSER, wired together with .pipe().
// Each piece has one job:
//   1. prompt   -> turns your variables into the actual text sent to the LLM
//   2. model    -> the LLM itself (here: Gemini)
//   3. parser   -> turns the LLM's raw response into something usable (plain string, JSON, etc.)
//
// You call chain.invoke({ ...variables }) once, and it runs all three steps for you.
// This is the exact same idea you'll use for every node in tomorrow's LangGraph agent —
// a node is basically "run a chain, then update the shared state with the result."

import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// 1. THE MODEL
// This is Gemini, wrapped so LangChain can talk to it the same way it talks to
// any other LLM provider. That's the point of LangChain: swap this one block
// and everything downstream (prompts, chains, graphs) stays identical.
const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-2.5-flash",
  temperature: 0.3, // lower = more focused/deterministic, higher = more creative
});

// 2. THE PROMPT
// "system" sets the LLM's role/behavior. "human" is the actual question, with a
// {company} placeholder that gets filled in when we call the chain.
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a concise financial analyst."],
  ["human", "In one sentence, what does the company {company} do, and what sector are they in?"],
]);

// 3. THE PARSER
// Gemini's raw response is an object with metadata. StringOutputParser just
// extracts the plain text reply, which is all we need right now.
const parser = new StringOutputParser();

// 4. THE CHAIN
// .pipe() connects them: prompt's output feeds into model's input,
// model's output feeds into parser's input.
const chain = prompt.pipe(model).pipe(parser);

async function main() {
  const company = process.argv[2] || "Tesla";
  console.log(`\nAsking Gemini about: ${company}...\n`);

  const result = await chain.invoke({ company });

  console.log(result);
  console.log("\nDone. Try: npm run hello -- \"Nvidia\"\n");
}

main().catch((err) => {
  console.error("\nSomething went wrong. Common causes:");
  console.error("- GOOGLE_API_KEY missing or invalid in your .env file");
  console.error("- You haven't run `npm install` yet\n");
  console.error(err.message);
});
