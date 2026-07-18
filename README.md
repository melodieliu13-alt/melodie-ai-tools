# I turn messy KOL research into decisions a growth team can use.

I'm Melodie Liu. I've spent eight years in user growth across education, FinTech and Web3.

KOL research used to mean opening dozens of tabs, reading timelines one by one and losing the context a week later. I built a working pipeline that saves the source material, makes it searchable and turns it into a monthly decision brief.

**The result:** 197 accounts and 11,100 tweets became a research archive I can query instead of reread.

---

## From a research question to a growth decision

Here is the kind of output the pipeline is built to produce:

> **Question:** Is AI pulling attention away from crypto?
>
> **First signal:** AI was gaining attention across the wider tech and finance conversation.
>
> **My decision:** “Capital siphoning” was too strong. The evidence showed an **audience mismatch**: crypto-native accounts and AI-curious mainstream audiences were responding to different stories.
>
> **Growth implication:** Do not use one message for both groups. Keep crypto-native acquisition focused on market utility; test AI-led positioning with the broader tech and finance audience.

[See the full Input → Output example](./03-case-studies/kol-growth-intelligence-output.md)

### The growth method behind it

The code in this repository is new; the operating logic has already been used in production. During an OKX regional expansion in Hangzhou, I applied AI across the BD workflow: discover local crypto, quantitative-trading and FinTech prospects; research their content and resources; match likely needs; prepare onboarding material; and compare OKX with competing platforms.

I personally opened **5 cross-sector partner nodes**. The team opened about **15**, including a quantitative-trading node developed collaboratively that reached **200M USDT in monthly trading volume** and qualified as a super node.

The relationship pipeline used this content-led triage:

| Tier | How I used it |
|---|---|
| **A — win** | High-fit partners worth deep research, a tailored proposal and deliberate follow-up |
| **B/C — develop** | Lower-stakes conversations used to test the pitch, learn objections and build future options |
| **D — observe** | Already committed elsewhere, explicitly uninterested or low-fit; useful as market and content signals, not active targets |

I now use the same model in both the public KOL research pipeline and a private JD Scout workflow: collect a noisy market, classify each opportunity by fit, protect my attention for the few A-tier conversations and compress D-tier items into market intelligence. The objects changed; the growth skill stayed the same—**finding the right relationship to advance, and knowing what not to chase.**

---

## What I built

| Before | After |
|---|---|
| Open tabs and read each timeline manually | Save monthly timelines as structured Markdown |
| Search from memory | Ask normal questions through two MCP tools |
| Produce a one-off summary | Use the same weighted report structure each month |
| Let every source count equally | Separate source authority, agreement and uncertainty |

| Part | What it does | Verify it |
|---|---|---|
| Timeline exporter | Saves a KOL's monthly timeline | [View code](./01-kol-growth-intelligence/twitter-exporter) |
| MCP server | Gives Claude `list_kols` and `search_kol` tools | [View code](./01-kol-growth-intelligence/mcp-server) · [Smoke test](./01-kol-growth-intelligence/mcp-server/smoke_test.js) |
| Decision brief | Turns retrieved material into a clear recommendation | [See output](./03-case-studies/kol-growth-intelligence-output.md) |
| Case study | Shows the decisions, failures and limits behind the workflow | [Read case](./03-case-studies/kol-growth-intelligence.md) |

### What broke in real use

X rate limits made a stalled page look like an account had posted nothing. I added longer waits, three recovery attempts and a second pass before accepting a zero result. When the working session was accidentally closed, the browser queue continued because its progress was stored locally.

---

## Two smaller tools built from the same habit

### Export 678 meeting transcripts

iFlyrec had no useful bulk export for my archive. I traced the site's real POST request and pagination cursor with AI, then built a Chrome extension that exports one transcript or loads the full history in batches.

[See the transcript exporter](./02-workflow-automation/transcript-exporter)

### Move 30–40 courses into my own notes

Copying lessons from Dedao one by one was never going to finish. This extension saves whole courses as Markdown and writes them directly to a folder on my Mac. It reached v1.85 after 55 rounds of real use and fixes, including failures that looked successful while saving the wrong title or silently cutting off text.

[See the course exporter](./02-workflow-automation/course-clippings-exporter) · [Read the engineering case](./02-workflow-automation/course-clippings-exporter/ENGINEERING_CASE_STUDY.md)

---

## Four ways I use AI in growth work

In practice, I use AI at four different points in a growth workflow:

| Growth job | Evidence |
|---|---|
| **Make business data usable by AI** | I wrapped a real KOL archive in an MCP server with working `list_kols` and `search_kol` tools. [View code](./01-kol-growth-intelligence/mcp-server) |
| **Turn noisy signals into a decision** | I designed a report that shows the signal, my interpretation, what to do next and what would change my mind. [See output](./03-case-studies/kol-growth-intelligence-output.md) |
| **Find and qualify the right partners** | At OKX, AI-assisted prospect discovery, research, need matching and onboarding supported 5 partner nodes I opened personally and about 15 across the team. |
| **Turn campaign rules into daily execution** | For an OKX campaign covering about 1,200 partner nodes, I used AI to turn tracking and instructions into a one-person daily workflow; the team ranked first among five teams on both campaign participation and first-trade rate (16–17% versus 5–6%). |

My part is choosing the problem, designing the workflow and deciding whether the result is useful. AI helps me build, test and iterate much faster.

Across eight years in growth, I managed roughly 300 affiliate partners and produced more than **25M USDT in cumulative profit** at OKX; moved first trades from **26 to 144** and rebates up **65%** in one KOL case; and reached an **18% expansion rate** at Zuoyebang against a 13–14% industry benchmark.

---

Melodie Liu (刘成成) · User Growth · English / 中文<br>
[Email me](mailto:melodieliu13@gmail.com)

<details>
<summary><strong>中文说明</strong></summary>

### 我做用户增长，也把繁杂的 KOL 研究变成增长团队能使用的判断。

过去研究 KOL，要逐个打开账号、翻时间线，读完很快就散了。我做了一条自己每天能用的流水线：插件保存 197 个账号、11,100 条推文；MCP Server 让我直接查询这批资料；月报则告诉我哪些信号值得行动。

这里既有代码，也有实际的输入输出和使用过程中踩过的坑。另两个插件分别解决 678 条会议转写无法批量导出，以及 30–40 门课程无法完整进入个人笔记的问题。

我负责选择问题、设计工作流、测试结果；AI 帮我更快地实现和迭代。

</details>
