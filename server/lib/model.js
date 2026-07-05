// COMPONENT: shared model
//
// One Gemini instance, reused by every node, so we're not re-configuring it
// five times. If you ever switch providers, this is the only file you touch.

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-3.1-flash-lite",
  temperature: 0.3,
});
