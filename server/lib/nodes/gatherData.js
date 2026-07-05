// NODE: gatherData
//
// This node calls the search tool directly (rather than letting the model
// decide whether to call it) because we always want research data at this
// stage - there's no ambiguity to leave to the model here. We run a couple
// of targeted searches and hand the raw results downstream.

import { searchTool } from "../tools/searchTool.js";

export async function gatherData(state) {
  const { ticker, sector, companyName } = state;
  const name = ticker || companyName;

  const [financials, news] = await Promise.all([
    searchTool.invoke(`${name} stock financial results revenue earnings`),
    searchTool.invoke(`${name} ${sector || ""} news competitors risks`),
  ]);

  return {
    researchData: { financials, news },
  };
}
