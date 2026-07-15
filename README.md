# Growth Intelligence Tools

**I do user growth. These are tools I built when the growth work hit a wall no off-the-shelf tool solved.**

Not demos, not tutorials — every one of these runs in my actual workflow. Each started the same way: a real problem I was already solving by hand, badly.

---

## The main line — a KOL growth-intelligence pipeline

In crypto growth, the raw material for every partnership decision is *what the KOLs are actually saying*. I was reading it by hand. That doesn't scale past ~10 accounts, and it leaves no archive to reason over later.

So I built the pipeline:

```
  ┌─────────────────────────┐
  │  kol-twitter-exporter   │   Chrome extension · 1,200 lines JS
  │  Scrapes a KOL's whole  │   → 197 accounts, 11,109 tweets
  │  month off X/Twitter    │   → full June-2026 archive, as Markdown
  └───────────┬─────────────┘
              ↓
  ┌─────────────────────────┐
  │     kol-signal-mcp      │   MCP server (Node, official SDK)
  │  Exposes the archive as │   → list_kols() / search_kol()
  │  tools an LLM can call  │   → ask Claude in plain language,
  └───────────┬─────────────┘      it does the tool-calling
              ↓
  ┌─────────────────────────┐
  │  Monthly intelligence   │   → who's gaining attention, which
  │  report (11 sections,   │      narratives are forming, which
  │  influence-weighted)    │      accounts are worth working with
  └─────────────────────────┘
```

**What it replaced:** manually opening tabs and reading. **What it produces:** a queryable archive of 11,109 tweets and a monthly report I actually use to decide who to talk to.

The interesting part isn't the scraping — it's the middle box. Wrapping my own data as **MCP tools** means I stop writing queries and start asking questions; the model figures out which tool to call. That's the difference between *using* AI and *building for* it.

| Tool | What it is | Status |
|---|---|---|
| [`kol-twitter-exporter`](./kol-twitter-exporter) | Chrome extension · scrapes X/Twitter KOL timelines → monthly Markdown | v3.4 |
| [`kol-signal-mcp`](./kol-signal-mcp) | MCP server · makes the archive queryable by Claude ([docs](./kol-signal-mcp/README.md)) | working, smoke-tested |

---

## Same pattern, different problems

Both of these exist because I hit a wall in my own work and no tool solved it.

| Tool | The wall | What I built |
|---|---|---|
| [`iflyrec-transcript-exporter`](./iflyrec-transcript-exporter) | Meeting recordings were transcribed but locked in a web UI — no bulk export, and I had 678 of them to review. | Reverse-engineered the site's real POST endpoint, request body and pagination cursor. One-click single export + full-history bulk export. `v0.6.1 · 506 lines` |
| [`dedao-clippings-exporter`](./dedao-clippings-exporter) | A course platform with no export. I needed whole courses in my notes, and the generic web clipper couldn't do batch. | DOM → Markdown, whole-course batch, written straight to disk via the File System Access API. `v1.85 · 3,567 lines` — the hard part was silent failures, see the [engineering case study](./dedao-clippings-exporter/ENGINEERING_CASE_STUDY.md) |

---

## Honest scope

Read this before judging the code:

- **These are built for my workflow, not packaged as products.** `kol-signal-mcp` reads a Markdown format that only `kol-twitter-exporter` produces. You could run the pair; you can't drop the MCP server into an unrelated setup and expect data. Nothing here is hardened for strangers, and I'm not claiming otherwise.
- **What I'm strong at is the layer above the code**: defining the problem, deciding the architecture, breaking down the work, and judging whether the output is right. The implementation is largely AI-written — I direct and verify it. That division is the point, not a disclaimer.
- **These tools produced judgments, not revenue.** They made my growth analysis faster and archivable. Attributing profit to them would be a claim I can't yet back with data — so I don't make it.

---

## Who I am

Melodie Liu (刘成成) — user-growth operator, 8 years across K12 education, FinTech and Web3.
OKX: ~300 affiliate nodes, 25M+ USDT cumulative profit. Working in global growth, in English.
📧 melodieliu13@gmail.com

---
---

# 中文版

**我做用户增长。这里是增长工作卡住时、现成工具解决不了，我自己造的东西。**

不是练手 demo——每一个都在我真实的工作流里跑。它们的起点都一样：一个我本来就在手动硬做、做得很烂的真问题。

## 主线 —— KOL 增长情报流水线

做 crypto 增长，每个合作决策的原料都是「KOL 到底在说什么」。我原本靠手动读。这个撑不过 10 个账号，而且读完不留档、事后没法回头推理。

于是有了这条链：

```
  kol-twitter-exporter（Chrome 扩展 · 1,200 行 JS）
     把一个 KOL 整月推文抓下来 → 197 个账号、11,109 条推文
                                   2026-06 完整存档，存成 Markdown
              ↓
  kol-signal-mcp（MCP Server · Node 官方 SDK）
     把存档封装成 LLM 能调用的工具 → list_kols() / search_kol()
     我用大白话问，模型自己决定调哪个工具
              ↓
  月度情报报告（11 个固定小节 · 影响力加权）
     → 谁在涨关注、什么叙事在成形、哪些账号值得合作
```

**它取代了什么**：手动开标签页读。**它产出什么**：一个能查询的 11,109 条推文存档，和一份我真的拿来决定「该找谁聊」的月报。

有意思的不是抓取，是中间那个盒子。把自己的数据封装成 **MCP 工具**，意味着我不再写查询、而是直接问问题，由模型决定调什么工具——这就是「用 AI」和「为 AI 而造」的分界线。

## 同一个模式，不同的问题

| 工具 | 撞的墙 | 造了什么 |
|---|---|---|
| `iflyrec-transcript-exporter` | 会议录音转写完了却锁在网页里，没有批量导出，而我有 678 条要复盘。 | 逆向出站点真实的 POST 接口、请求体和翻页游标。单条导出 + 全历史批量导出。`v0.6.1 · 506 行` |
| `dedao-clippings-exporter` | 课程平台不给导出。我要整门课进笔记，通用网页剪藏做不了批量。 | DOM → Markdown，整门课批量，用 File System Access API 直接写盘。`v1.85 · 3,567 行`——最难的是静默失败，见工程复盘 |

## 诚实的边界

- **这些是为我自己的工作流造的，不是打包好的产品。** `kol-signal-mcp` 读的 Markdown 格式只有 `kol-twitter-exporter` 生产得出来。这一对可以配着跑；但你没法把 MCP server 单独塞进别的环境还指望它有数据。这里没有任何东西是为陌生人加固过的，我也不假装有。
- **我强的是代码之上那一层**：定义问题、定架构、拆任务、判断产出对不对。实现主要由 AI 写，我指挥并验收。这个分工是重点，不是免责声明。
- **这些工具产出的是判断，不是收入。** 它们让我的增长分析更快、可存档。把利润归因给它们，是我目前拿不出数据支撑的主张——所以我不这么说。

## 关于我

刘成成 Melodie Liu —— 用户增长操盘手，8 年横跨 K12 教育、FinTech、Web3。
OKX：约 300 个 affiliate 节点，累计产出利润超 2500 万 USDT。做全球市场的增长，工作语言英语。
📧 melodieliu13@gmail.com
