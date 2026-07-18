# Case Study · KOL Growth Intelligence

## One-line summary

I replaced manual KOL timeline reading with a working pipeline that archives 197 accounts / 11,100 tweets, exposes the archive to an LLM through MCP tools, and supports a repeatable partnership-intelligence report.

## 1. The growth problem

KOL partnerships require more than follower counts. The useful signals are dispersed across timelines: what an account repeatedly discusses, which products it stands behind, how its position changes and whether multiple credible sources converge.

Manual reading worked for a handful of accounts. It did not scale, could not be searched reliably later and made month-to-month comparison difficult.

## 2. The product decision

I did not begin with “build an AI agent.” I began with the information bottleneck:

1. preserve the source material in a stable format;
2. make it queryable without requiring technical search syntax;
3. synthesize it through a consistent report structure;
4. keep the final growth judgment with the operator.

That produced a three-layer design: collection, retrieval and decision support.

## 3. What runs

### Collection

The Chrome extension archives monthly X/Twitter timelines as Markdown. It was iterated under real operating pressure, including rate limits and interrupted sessions, and reached a full archive of **197 accounts and 11,100 tweets**.

### Retrieval

The Node MCP server exposes two working tools:

- `list_kols` — inspect the available archive;
- `search_kol` — search the archive through an LLM tool call.

A smoke test is included in the repository.

### Decision support

The archive feeds an influence-weighted monthly intelligence structure designed to surface attention shifts, emerging narratives, source agreement and accounts worth further investigation.

[See a sanitized Input → Output example](./kol-growth-intelligence-output.md).

## 4. A decision the workflow supported

One research question was whether AI was pulling attention away from crypto. The first synthesis made the relationship sound causal. I rejected that framing: attention data could not prove capital movement, and the source pattern pointed to different audiences rather than one zero-sum audience.

The revised judgment was **audience mismatch**. For growth work, that means testing separate messages for crypto-native users and AI-curious technology/finance audiences instead of treating them as one segment.

### From market signals to relationship priorities

The pipeline supports a partner-triage model I used in KOL growth at OKX:

- **A — win:** research deeply, build a tailored proposal and follow up deliberately;
- **B/C — develop:** use lower-stakes conversations to test the pitch, learn objections and keep future options open;
- **D — observe:** do not spend active acquisition time, but retain the account as a market and content signal.

I later reused the same logic in a private JD Scout workflow. Job opportunities and KOL partners are different objects, but the operating problem is the same: collect a noisy market, qualify relationship value and reserve scarce attention for the few conversations worth advancing. I present this as evidence that the growth method transfers—not as a claim that a job-search tool has already acquired B2B customers.

## 5. What broke in real use

- X rate limits made a stalled page look like a genuine zero-post result. I added longer waits, three recovery attempts and an automatic second pass before accepting zero.
- A single followed-account list missed important people by construction. I kept a manual addition path instead of pretending automated coverage was complete.
- The first report was a descriptive research summary. I rejected it and defined a weighted decision brief with explicit implications, confidence and disagreement.

## 6. My role versus AI

| I owned | AI supported |
|---|---|
| Defined the partnership-research bottleneck | Drafted and revised implementation code |
| Chose the browser → Markdown → MCP architecture | Assisted debugging and documentation |
| Set source-preservation and report requirements | Performed repetitive transformations |
| Tested real accounts and rejected bad outputs | Accelerated iterations after each failure |
| Retained the final partnership judgment | Did not own the business decision |

## 7. Evidence

| Evidence | Location |
|---|---|
| Timeline exporter | [`01-kol-growth-intelligence/twitter-exporter`](../01-kol-growth-intelligence/twitter-exporter) |
| MCP server | [`01-kol-growth-intelligence/mcp-server`](../01-kol-growth-intelligence/mcp-server) |
| Smoke test | [`smoke_test.js`](../01-kol-growth-intelligence/mcp-server/smoke_test.js) |
| MCP documentation | [`README.md`](../01-kol-growth-intelligence/mcp-server/README.md) |
| Sanitized output | [`Input → Output`](./kol-growth-intelligence-output.md) |

The raw KOL archive and internal report are intentionally not published because they contain collected source material and private working analysis. The code repository contains no tweet archive, meeting transcript, token or private key.

## 8. Outcome and boundary

**Outcome:** a manual research process became a searchable, repeatable intelligence workflow that I use to decide what and whom to investigate.

**Boundary:** this system produced decision support, not a separately attributable revenue result. It demonstrates AI-native growth execution; it does not claim that the tools caused the career growth figures shown on the portfolio homepage.
