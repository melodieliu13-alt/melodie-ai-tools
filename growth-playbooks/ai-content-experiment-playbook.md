# AI Content Experiment Playbook — Coinbase AgentKit

> **Experiment-ready playbook; not yet a completed growth result.**

## Scenario and evidence status

**Product:** [Coinbase AgentKit](https://github.com/coinbase/agentkit), a public open-source toolkit for enabling AI agents to use wallets and take onchain actions. The scenario is based only on Coinbase's public [AgentKit overview](https://docs.cdp.coinbase.com/agent-kit/welcome) and [official quickstart](https://docs.cdp.coinbase.com/agent-kit/getting-started/quickstart).

This is a protocol for Melodie's next real public content experiment. **No experiment content has been published. There are no impressions, clicks, registrations, installs, wallet creations, transactions or conversion results.** This is not an internal Coinbase plan, does not imply a partnership or endorsement, and does not claim access to Coinbase product analytics.

**Evidence status: Next experiment.** The status can change only after the content, URLs, measurement export and decision record exist.

## 1. Product and target user

The product scenario is Coinbase AgentKit. Its public documentation describes a toolkit and CLI for creating agents that can interact with blockchain networks; the quickstart supports TypeScript and Python paths.

**Primary target user:** an AI application developer who can already build a basic agent but has not yet added an onchain wallet or action.

**Narrow use case for the experiment:** help that developer understand the shortest path from a local agent to one visible testnet action, then decide whether to open the official quickstart.

## 2. Growth problem

“Give an AI agent onchain capabilities” is a broad category promise. A developer may still be unsure what the first concrete outcome looks like, what setup is required, and whether trying it creates financial or key-management risk.

This is a hypothesis to test, not a claim based on Coinbase user research. The experiment asks whether one small, testnet-first outcome generates more qualified interest in the official documentation than an abstract explanation of AgentKit's capabilities.

## 3. Signal and content hypothesis

**Public signal:** the official quickstart gives a concrete first action—create a project, configure required credentials, run it locally and ask the agent to fund a wallet with testnet ETH.

**Content hypothesis:** for AI developers who are curious about Web3 but have not built an onchain agent, an outcome-first explanation of one testnet action will produce a higher qualified-docs-click rate than a category-first explanation of AgentKit's capabilities.

The experiment tests message framing. It does not test whether AgentKit creates retained developers or onchain activity.

## 4. Audience segment

**Included:**

- developers who have used an agent framework or model API;
- builders exploring wallets, payments or onchain actions for an agent;
- people willing to use a testnet before considering a production wallet.

**Excluded:**

- audiences seeking token picks, trading signals or investment returns;
- users looking for a no-code consumer trading bot;
- anyone who interprets the content as financial advice.

## 5. Signal → angle → content variants

Keep the format, author account, CTA and approximate length constant. Change only the framing variable.

### Variant A — outcome first

**Signal:** the quickstart ends with a visible testnet wallet action.

**Angle:** “What is the smallest onchain action an AI agent can complete?”

**Draft hook:**

> An AI agent becomes easier to understand when it completes one small onchain task. Here is the public AgentKit path from a local project to a testnet wallet action—and the checks I would make before trying it.

**Body outline:** expected outcome → prerequisites → official quickstart steps → testnet and key-safety boundary → official documentation CTA.

### Variant B — friction first

**Signal:** the quickstart requires a development environment, credentials, a selected framework, network and wallet provider.

**Angle:** “What should a developer check before adding an onchain action to an agent?”

**Draft hook:**

> Before giving an AI agent a wallet, I would check five things: the first-value action, network, wallet provider, credential handling and a testnet stop condition. AgentKit's public quickstart makes those choices concrete.

**Body outline:** five-decision checklist → where the official quickstart addresses each item → testnet boundary → official documentation CTA.

Two variants are enough for the first test. Do not manufacture dozens of posts or change format, CTA and audience at the same time.

## 6. Human fact-check and compliance boundary

Before publication, Melodie must:

1. Re-open the official AgentKit overview, quickstart, GitHub README and legal section on the publication date.
2. Remove any capability not supported by those current sources.
3. Demonstrate only testnet behavior; never expose an API key, seed phrase, private key, wallet secret or funded account.
4. Avoid price predictions, return claims, automated-trading promises or language that could be read as investment advice.
5. State that AgentKit is experimental where relevant and link readers to the official documentation.
6. State that the content is independent analysis and that Melodie has no Coinbase partnership or product-analytics access.
7. Use AI for drafting and comparison, while keeping final fact-checking, compliance and publication decisions with Melodie.

If a safe walkthrough would require publishing credentials, using real funds or implying product access that Melodie does not have, the experiment does not run.

## 7. Channel and distribution plan

**Primary channel:** Melodie's public X account, where AI and Web3 builders can inspect the full post and follow the same official links.

**Test design:** two matched rounds over two weeks.

- Round 1: publish Variant A and Variant B on the same weekday and time window, separated enough to avoid posting them back-to-back.
- Round 2: reverse the order and time slots to reduce order bias.
- Hold author account, format, approximate length, CTA and target audience constant.
- Do not pool LinkedIn, community reposts, paid distribution or private messages into the A/B result. Record them separately if they occur.

Because this is an organic sequential test rather than randomized user assignment, the result will remain directional.

## 8. UTM structure and qualified event

Each post points first to a Melodie-controlled, privacy-safe experiment page that states the disclaimer and links onward to the official AgentKit quickstart. The page records aggregate events only.

**Campaign:** `agentkit_first_onchain_action_2026q3`

```text
utm_source=x
utm_medium=organic_social
utm_campaign=agentkit_first_onchain_action_2026q3
utm_content=outcome_first_a1
```

The other content values are:

- `friction_first_b1`
- `friction_first_b2`
- `outcome_first_a2`

**Primary qualified event:** `qualified_docs_click` — a non-bot, non-self unique session clicks from the experiment page to the official AgentKit quickstart after spending at least 20 seconds on the page or expanding the setup checklist.

**Primary metric:** qualified-docs-click rate = qualified outbound clicks ÷ eligible post impressions.

Replies, likes, saves and profile visits are diagnostic only. Coinbase registrations, installs, wallet creation and transactions are not observable and must not be inferred.

## 9. A/B rule and minimum decision threshold

Declare Variant A or B the stronger framing only if all conditions are met:

1. Each variant accumulates at least **1,000 eligible impressions** and **20 qualified_docs_click events** across the two matched rounds.
2. The winning variant's qualified-docs-click rate is at least **30% higher** than the other variant.
3. The direction of the difference repeats in both rounds.
4. No material distribution anomaly, repost or unrelated news event explains the difference.

If the minimum sample is not reached after two rounds, record **inconclusive**. Do not extend the test by silently changing the threshold.

## 10. What this experiment can—and cannot—prove

This experiment can support only a claim about Melodie's content framing and qualified outbound clicks from her controlled page.

It cannot establish:

- AgentKit adoption, developer retention or ecosystem growth;
- Coinbase registrations, API-key creation, installs or transactions;
- causal impact on Coinbase business metrics;
- the effectiveness of AI-generated content in general;
- a randomized causal result, because organic X distribution is not randomized.

AI may help draft and compare variants. It does not own the hypothesis, factual verification, publishing decision, metric definition or interpretation.

## 11. Stop condition

Stop or postpone the experiment if:

- the official product, quickstart or legal guidance changes materially before publication;
- the content cannot be verified from current official sources;
- safe demonstration would require real funds or secret credentials;
- either variant fails to reach the minimum threshold after two matched rounds;
- a distribution anomaly makes the comparison uninterpretable;
- replies show that the framing attracts investment-seeking users rather than the target developer segment.

An inconclusive or stopped test remains a valid record if the reason and evidence are preserved.

## 12. Evidence the completed experiment must leave behind

The status cannot move beyond **Next experiment** until the public evidence bundle contains:

1. URLs and screenshots for all published variants, with publication dates.
2. The exact copy, CTA and UTM mapping used in each round.
3. A privacy-safe aggregate analytics export showing eligible impressions, exclusions and qualified events.
4. The calculation for each variant's qualified-docs-click rate.
5. A short decision record: winner, inconclusive or stopped—and why.
6. Any factual correction, compliance concern, distribution anomaly or failed assumption.
7. The next action that followed from the result.

Until those objects exist, this page proves experiment design only—not content performance or growth impact.
