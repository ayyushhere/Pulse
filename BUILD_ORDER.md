# InvestIQ — component build order

We build in this order because each piece depends on the one before it.
No time-boxing — just work through them in sequence.

| # | Component | Location | What it does |
|---|-----------|----------|---------------|
| 1 | Chain basics | `server/scripts/hello-world.js` | Done. prompt -> model -> parser |
| 2 | Search tool | `server/lib/tools/searchTool.js` | Wraps Tavily so the LLM can pull live web data |
| 3 | Shared state | `server/lib/state.js` | The object every graph node reads/writes |
| 4 | Graph nodes | `server/lib/nodes/*.js` | One file per step: resolve, gather, analyze x2, decide |
| 5 | The graph | `server/lib/graph.js` | Wires nodes + edges into the LangGraph pipeline |
| 6 | Express server | `server/index.js` | Exposes the graph over `POST /api/research` |
| 7 | React client | `client/src/*` | Form + result display, calls the server |
| 8 | README + deploy | root | Write it up, ship it |

Each node file is small and single-purpose on its own — that's the point of
using a graph instead of one giant prompt. We'll build them one at a time,
testing each before moving to the next.
