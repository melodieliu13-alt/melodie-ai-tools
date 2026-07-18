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
>
> **Boundary:** this was a directional research judgment, not proof of capital flows or campaign lift.

[See the full Input → Output example](./03-case-studies/kol-growth-intelligence-output.md)

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
| Decision brief | Turns retrieved material into a bounded growth judgment | [See output](./03-case-studies/kol-growth-intelligence-output.md) |
| Case study | Shows the decisions, failures and limits behind the workflow | [Read case](./03-case-studies/kol-growth-intelligence.md) |

### What broke in real use

X rate limits made a stalled page look like an account had posted nothing. I added longer waits, three recovery attempts and a second pass before accepting a zero result. When the working session was accidentally closed, the browser queue continued because its progress was stored locally.

The raw tweet archive and private reports are not published. This repository contains code, documentation and a sanitized output only.

---

## Two smaller tools built from the same habit

### Export 678 meeting transcripts

iFlyrec had no useful bulk export for my archive. I traced the site's real POST request and pagination cursor with AI, then built a Chrome extension that exports one transcript or loads the full history in batches.

[See the transcript exporter](./02-workflow-automation/transcript-exporter)

### Move 30–40 courses into my own notes

Copying lessons from Dedao one by one was never going to finish. This extension saves whole courses as Markdown and writes them directly to a folder on my Mac. It reached v1.85 after 55 rounds of real use and fixes, including failures that looked successful while saving the wrong title or silently cutting off text.

[See the course exporter](./02-workflow-automation/course-clippings-exporter) · [Read the engineering case](./02-workflow-automation/course-clippings-exporter/ENGINEERING_CASE_STUDY.md)

---

## What I owned, and what AI did

I chose the problems, defined the output, set the acceptance rules, tested the tools on real work and rejected results that ran correctly but were not useful.

AI wrote most of the implementation and helped debug it. My role was to turn an operating problem into a buildable workflow and decide where automation stopped and human judgment began.

That work sits on top of eight years in growth: roughly 300 affiliate partners and more than 25M USDT in cumulative profit at OKX; first trades from 26 to 144 and rebates up 65% in one KOL case; and an 18% expansion rate at Zuoyebang against a 13–14% industry benchmark. These career results predate this repository and are not attributed to its tools.

---

Melodie Liu (刘成成) · User Growth · English / 中文<br>
[Email me](mailto:melodieliu13@gmail.com)

<details>
<summary><strong>中文说明</strong></summary>

### 我做用户增长，也把繁杂的 KOL 研究变成增长团队能使用的判断。

过去研究 KOL，要逐个打开账号、翻时间线，读完很快就散了。我做了一条真实在用的流水线：插件保存 197 个账号、11,100 条推文；MCP Server 让这批资料可以直接查询；固定的月报结构把信息压成有边界的增长判断。

这个仓库展示的不只是代码，也展示输入如何变成输出、真实使用中哪里坏过，以及哪些判断必须由我来做。另两个插件分别解决 678 条会议转写无法批量导出，以及 30–40 门课程无法完整进入个人笔记的问题。

实现和调试主要由 AI 完成；问题选择、输出标准、真实验收和最终业务判断由我负责。

</details>
