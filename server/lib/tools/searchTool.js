// COMPONENT: search tool
//
// Tavily is a search API built for LLM use - it returns clean, summarized
// web results instead of raw HTML. We call it directly with fetch rather
// than through LangChain's tool wrapper, because we decide when to search
// ourselves (in gatherData.js) rather than letting the model decide - so we
// don't need the extra abstraction, and this avoids a dependency conflict
// that @langchain/community's Tavily integration pulls in (typeorm/sqlite).

const TAVILY_URL = "https://api.tavily.com/search";

export const searchTool = {
  async invoke(query) {
    const res = await fetch(TAVILY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query,
        max_results: 5,
        search_depth: "basic",
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Tavily search failed (${res.status}): ${text}`);
    }

    const data = await res.json();
    // Return just the useful bits - title, url, and content snippet per result
    return data.results.map((r) => ({
      title: r.title,
      url: r.url,
      content: r.content,
    }));
  },
};

// Quick manual test you can run directly: `node server/lib/tools/searchTool.js`
// (only runs if this file is executed directly, not when imported elsewhere)
if (import.meta.url === `file://${process.argv[1]}`) {
  const { default: dotenv } = await import("dotenv");
  dotenv.config();

  const query = process.argv[2] || "Tesla Q4 2025 earnings";
  console.log(`\nSearching Tavily for: "${query}"...\n`);

  const results = await searchTool.invoke(query);
  console.log(results);
}
