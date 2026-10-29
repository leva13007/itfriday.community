---
title: "How I turned a conference into an article for my team"
description: "After ServerlessDays Cardiff 2026 I wrote an internal article for my team lead and fellow devs. How I picked topics, found one thesis and wrote it without blame — plus the article itself."
date: 2026-10-29
tags: [career, tech]
---

# How I turned a conference into an article for my team

_Oleh Levchenko · IT Friday · October 2026_

---

On a stream I mentioned that after ServerlessDays Cardiff I wrote an internal article for my team — and several people asked to see it. Here it is. But the more interesting part is probably not the article itself, it is how it was made: what I threw out, how I looked for the main idea, and why the text is written the way it is.

So there are two parts. Part 1 is the process. Part 2 is the article itself, with names and internal company details removed.

## Part 1. How the article was made

### The input: far too much material

On 20–21 October 2026 I attended ServerlessDays Cardiff: a workshop day on Lambda MicroVMs and a conference day with 11 talks. Afterwards I had:

- audio recordings of the talks and machine transcripts;
- photos of the slides;
- workshop notes and code — [MicroVMs_Workshop](https://github.com/leva13007/MicroVMs_Workshop).

That is hours of material. My colleagues have 10–15 minutes to read between tasks. The real work is not retelling — it is **choosing**.

### Step 1. Start with who will read it

The audience: the developers on my team, our team lead and possibly the product manager. That gives two requirements:

- developers need technical depth — how things work inside, not marketing;
- the PM needs a business example that makes sense without code.

Everything else follows from the audience. For architects or for senior management it would be a completely different article.

### Step 2. Ruthless selection

Out of 11 talks, ideas from three made it in: the keynote on how Lambda has evolved, the talk on durable functions, and the talk on friction in software delivery. Plus the workshop.

What I dropped, even though the talks were good: digital sovereignty, AI in the SOC, the AI-in-fintech panel, governance for AI agents, AgentOps. Not because they were bad — for this audience they don't lead to a next step.

One criterion: **can the team actually do something with this soon?** Lambda — yes, it is our stack. Friction — yes, we have it. Sovereignty — no.

### Step 3. Slides or an article

I first planned a presentation and even laid it out slide by slide. Then I switched to an article. What that gave me:

- people read it asynchronously, when it suits them, not on a dedicated call;
- they can comment next to a specific sentence;
- it stays around after the discussion and can be linked from tickets.

### Step 4. One thesis instead of an overview

An overview of “five new AWS features” is forgotten in a day. The text needs one idea that holds it together. It came out like this:

> **Event functions are no longer our only hammer.** For years we shaped business problems around one tool's limits. Now each of those limits has its own tool.

From that thesis came the “constraint map” — a table of *limit → how we worked around it → the new tool*. It became the spine of the article: every section after it takes one of its rows.

### Step 5. No blame

The most delicate part. The article inevitably says: “our system has workarounds worth revisiting”. Our team lead changed recently, and before that developers often decided for themselves how to build things. A text like this can easily read as “here is what you did wrong”.

The fix is to put the “blame” on the tool — and that is honest: in the keynote AWS itself described those limits as deliberate trade-offs of the Lambda model. Hence the section “The limits were Lambda's, not ours” and the line “None of that was a mistake”. Reviewing old decisions is not a hunt for culprits, it is planning upgrades.

### Step 6. Honest relevance

The easy thing is to sell everything you saw with enthusiasm. But if everything is “urgent”, nobody believes any of it. So every topic got an honest rating:

- **durable functions** — a real candidate for a spike;
- **web functions** — interesting, but the service is two weeks old and not yet in our region;
- **MicroVMs** — I say plainly that we don't need them yet.

That “we don't need this yet” is what makes the rest of the text credible.

### Step 7. Friction: measure first, fix later

For friction (drag / fog / heat / wall, from the Microsoft talk) I wanted to write “here is how we'll remove it”. But honestly I don't know where our friction is worst — I have impressions, not data. So the proposal is a two-week friction log, not ready-made fixes.

### Step 8. Next steps: small, reversible, owned

The article doesn't end with “thanks for reading” but with a checklist: a review of existing services, a durable functions spike, a web functions spike (with a condition), a friction log. Every step is small and reversible, which makes it easier to say yes. And it ends with “happy to own these” — a proposal without an owner goes nowhere.

### Step 9. Facts from documentation, not transcripts

Machine transcripts are confidently wrong: Gunnar becomes “Jonnar”. On stage we heard “64 requests per environment by default, up to 128”; the AWS announcement just says “up to 128”. And the fact that web functions and MicroVMs are not yet available in London wasn't mentioned at the conference at all — I only found it in the docs. For a team running in the UK that is a critical detail.

The rule: numbers, limits and regions come only from official sources, linked at the end of the article.

### About AI

I drafted the text, gathered facts and checked them against the documentation together with Claude. The choice of topics, the thesis, the tone and the decisions are mine. I think that is a normal way to work, and there is no reason to hide it.

### What changed for publication

I removed names, the company name, the region and internal infrastructure details. Everything else is as it was. Below is the original English text; the [Ukrainian version of this page](/posts/2026-10-29-serverlessdays-article-for-team) has a translation.

---

## Part 2. The article itself

### Event functions are no longer our only hammer

_What I brought back from ServerlessDays Cardiff 2026 — and what it could mean for us_

#### TL;DR

For years Lambda gave us one shape: an event in, a response out, at most 15 minutes, one request per environment. We bent business problems to fit that shape. At ServerlessDays Cardiff 2026 (20–21 October) AWS presented Lambda as a family of tools, each one removing one of those old limits.

This article covers three of them — **durable functions**, **web functions** and **MicroVMs** — and asks the team for two things:

- **Look forward:** which business ideas become cheap now that the limits are gone.
- **Look back:** which workarounds in our current stack deserve a planned upgrade.

It ends with a smaller ask: before we try to fix delivery friction, let's measure where it actually is.

#### Why this matters: the limits were Lambda's, not ours

In his keynote, Julian Wood (Principal Developer Advocate for Serverless, AWS) was open about it: the classic Lambda model was a set of deliberate trade-offs. One request per environment kept executions isolated. A 15-minute cap kept the service manageable. Billing on wall-clock time kept pricing simple. You never touched the sandbox underneath.

Those choices made Lambda great, and they also forced every team that used it to build workarounds:

- A **web framework** needed an adapter layer to translate HTTP into Lambda events and back.
- A **process that waits** — for a person, a webhook, a slow downstream call — was paid for while it waited, or was split across queues, state tables and scheduled jobs.
- **Spiky web traffic** meant cold starts, warmers or provisioned concurrency.
- **Untrusted or AI-generated code** had to run somewhere else entirely.

None of that was a mistake. It was the right call with the tools available at the time, and most of the industry did the same. What changed is that AWS now ships a dedicated tool for most of these limits. So the question is no longer “how do we squeeze this into a Lambda” but “which tool fits this problem”.

> **Event functions are no longer our only hammer.** For years we shaped business problems around one tool's limits. Now each of those limits has its own tool.

#### The constraint map

Each classic limit now has a tool aimed at it. The rest of the article goes through the table row by row. The middle column matters most for us: it is the list of patterns to look for in our own stack.

| Limit of event functions | The usual workaround | The tool aimed at it |
| --- | --- | --- |
| 15-minute cap, no state between invocations | Queues, state tables, scheduled jobs, Step Functions for code-only workflows | **Durable functions** |
| Paying for time spent waiting on a database, API or LLM | Accept the cost, tune memory down | **Web functions** (billed for active CPU) |
| One request per environment, cold starts on spiky traffic | Provisioned concurrency, warmers | **Web functions** (many requests per environment) |
| Handler format instead of an HTTP server | Adapter libraries that translate HTTP to events and back | **Web functions** (listens on a port) |
| Isolating untrusted or AI-generated code | Separate EC2 or container fleets | **MicroVMs** |
| Steady high traffic is expensive | Move to ECS or EC2 | **Lambda Managed Instances** (out of scope here) |

The table reads two ways. Left to right, it shows what we can stop doing. Right to left, it shows ideas that used to be “too awkward for Lambda” and are now ordinary code.

#### Durable functions: workflows that wait, written as plain code

A durable function is a normal Lambda function that can pause for up to a year without paying for compute, and recover from failures without redoing finished work. The SDK supports Node.js (TypeScript included), so it fits our NestJS stack.

**How it works inside.** The model is **execute → checkpoint → suspend → replay**:

1. Each durable operation (`step`, `wait`, `invoke`, a wait for an external callback) saves its result to a checkpoint log that Lambda manages.
2. When the code waits, or something crashes, the invocation simply stops.
3. On the next invocation the handler runs again from the top. Completed operations return their saved result instead of running again, so execution fast-forwards to the first unfinished operation.

Julian's analogy is a save game: you never replay the levels you already finished. One execution can span many invocations. Each invocation still has the normal per-invocation timeout, but the whole execution can last up to 1 year ([AWS docs](https://docs.aws.amazon.com/lambda/latest/dg/durable-basic-concepts.html)).

The one rule that matters: **on replay, everything outside an operation runs again.** A model call, a generated ID, `Date.now()`, an SMS send — anything non-deterministic or with a side effect — goes inside a `step`.

**An example from our domain.** Gunnar Grosch (Developer Advocate at Sinch, AWS Serverless Hero) built his whole talk around a clinic appointment reminder that turns into a conversation. Swap “clinic appointment” for “lesson” and it is our domain:

1. A reminder about tomorrow's lesson goes out.
2. The pupil replies “can we move it?” — maybe in five minutes, maybe tomorrow.
3. We offer two slots and wait again.
4. The pupil picks one; we book it in the booking system and send a confirmation.

The usual serverless build for this is a webhook, a queue, a processor, a sender and a state table keyed by conversation — and careful code so that a retry doesn't send the same SMS twice. As a durable function it is one loop:

```ts
// Sketch only — check the SDK reference for exact signatures.
export const handler = withDurableExecution(async (event, ctx: DurableContext) => {
  await ctx.step('send-reminder', () => sms.send(event.pupil, reminderText(event.lesson)));

  for (let turn = 1; ; turn++) {
    const reply = await ctx.waitForCallback(`reply-${turn}`, (callbackId) =>
      saveCallbackId(event.conversationId, callbackId)); // the inbound-SMS webhook completes it

    const decision = await ctx.step(`decide-${turn}`, () => decideNextAction(reply));
    if (decision.kind === 'done') break;

    if (decision.kind === 'book') {
      await ctx.step(`book-${turn}`, () => bookings.move(event.lesson, decision.slot, { idempotencyKey: `${event.conversationId}-${turn}` }));
    }
    await ctx.step(`send-${turn}`, () => sms.send(event.pupil, decision.message));
  }
});
```

While the pupil thinks, nothing runs and nothing is billed for compute. If the booking call fails after the reply was processed, only the booking step is retried.

**Lessons from running it in production.** Gunnar had this running with real customers. His notes, plus the AWS best-practice page:

- **The durable part never failed; the model did.** Recovery doesn't make an answer correct. If an LLM drafts the reply, check its structured output against the real booking system before sending.
- **Steps are not exactly-once.** A step can run again if the function dies mid-step. Anything with an external effect (SMS, booking, payment) needs an idempotency key.
- **Store the callback ID yourself.** Looking up executions through the list API is rate-limited (he quoted ~15 requests/second by default); keep the callback ID per conversation in your own table.
- **Pin versions and never rename steps** while executions are running. Executions are pinned to the version that started them; step names are the contract replay relies on ([best practices](https://docs.aws.amazon.com/lambda/latest/dg/durable-best-practices.html)).
- **Failed executions are not retried automatically.** Attach a dead-letter queue and alarm on terminal states.
- **Decide the timeouts up front:** what happens if nobody replies, and what happens if two messages arrive mid-turn.

**Durable functions or Step Functions?** Both stay. Julian's rule of thumb: Step Functions is best when the workflow mostly orchestrates **AWS services** (no code needed, visual editor, other teams can read it). Durable functions are best when the workflow is mostly **application logic** — branching, calling our own APIs, calling a model — and you want to debug it like normal code.

**Where it could fit us:** any flow that waits for a person or an event — reminders, confirmations, approvals, follow-ups — and anything currently held together by a scheduled job that polls for state.

#### Web functions: Lambda that just listens on a port

Web functions, announced on 12 October 2026, run a normal HTTP server on Lambda. Your app reads the port from an environment variable and starts listening — Express, Fastify, Hono or NestJS, with no adapter layer ([AWS News Blog](https://aws.amazon.com/blogs/aws/announcing-aws-lambda-web-functions-for-fast-consistent-web-app-performance-anywhere/)). Classic functions are renamed **event functions** with no code change.

**What is different inside:**

- **Many requests per environment.** One warm environment serves up to 128 concurrent requests, like any web server. The first request still has a cold start, but it is shared across all the requests that follow. In Julian's load demo, 200 concurrent long-held connections ran on about 5 environments instead of 200.
- **You pay for active CPU, not for waiting.** CPU is billed only while code is actually running; memory is billed while the environment exists. Time spent waiting on a database or downstream API costs little CPU. Julian's estimate for the worst case — a rarely called function kept alive — was around a dollar a month.
- **Same code locally and in the cloud.** `npm run start` locally, one CLI command to deploy. No Lambda emulator.
- **Built-in canary releases.** Immutable revisions plus weighted traffic between them (for example 90/10).
- **Optional multi-region** with one global URL and latency-based routing; HTTP streaming; VPC access.

**What it could mean for us.** Our API layer is NestJS + GraphQL, and a lot of its time is spent waiting on the database and other services. That is exactly the profile where “pay for CPU, not for waiting” and “many requests per environment” help: fewer cold starts, fewer environments, and the app runs the same way on a laptop as in AWS.

**Why this is a spike, not a migration:**

- **It is two weeks old.** At launch: Node.js only (Node.js 24 on Arm64) and five regions — N. Virginia, Ohio, Oregon, Tokyo and **Ireland**. No London yet.
- **Shared state between requests is back.** One environment now serves many requests at once, so module-level state, per-request caches and anything that assumed “one request per container” needs a review.
- **Event functions remain the right choice** for SQS, Kinesis, S3 and other event triggers, and when you want one-request-per-environment isolation (for example in multi-tenant work).

**Open question for us:** how is the API layer deployed today — Lambda with an adapter, or something else? The answer decides whether web functions are an upgrade for us or just an interesting option.

#### MicroVMs: the Lambda sandbox, handed to us

Lambda has always run each function inside a Firecracker microVM that we never saw. MicroVMs (launched in June 2026) expose that sandbox: an isolated virtual machine with its own kernel, built from an ordinary Dockerfile and controlled by us ([AWS News Blog](https://aws.amazon.com/blogs/aws/run-isolated-sandboxes-with-full-lifecycle-control-aws-lambda-introduces-microvms/)).

**How it works:**

- **Image = Dockerfile + snapshot.** Lambda builds the image, runs your initialisation, then snapshots memory and disk. Every launch starts from that snapshot instead of booting, so it is up in about a second.
- **We control the lifecycle:** launch, suspend, resume, terminate. An idle policy can suspend a VM automatically and resume it on the next request, keeping memory and disk.
- **Each VM gets its own HTTPS endpoint.** Up to 8 hours of runtime per VM, up to 16 vCPUs and 32 GB of memory, Arm64 (Amazon Linux 2023).

**What I built at the workshop.** The hands-on workshop (Mike Hume, Pete Davis and Julian Wood, AWS) covered three patterns on top of the same building blocks:

1. **Event-driven coding agent.** A pull request triggers a fresh MicroVM; an AI agent inside reviews the diff and posts the review back; the VM is terminated. A durable function orchestrates the lifecycle and waits on a callback.
2. **Ephemeral CI runner.** One clean VM per job, which tears itself down when idle.
3. **Multi-tenant SaaS.** One VM per customer behind a control plane, launched on first use, with storage access scoped per tenant.

My notes and code: [MicroVMs_Workshop](https://github.com/leva13007/MicroVMs_Workshop).

**Honest relevance for us.** Today we have no direct need. Our CI already gives us clean, per-build environments, and an AI review agent would hit the same token budget as any other AI tooling. MicroVMs are also not available in London: the 14 regions so far include Ireland, Frankfurt, Stockholm and Spain ([regions update](https://aws.amazon.com/about-aws/whats-new/2026/10/lambda-microvms-4-additional-regions/)).

The idea worth keeping in mind is **an isolated preview or end-to-end test environment per pull request** that costs nothing while idle. Whether that works for us depends on how we handle the database and test data, so it belongs in the “know it exists” column, not on a roadmap.

#### Looking back: a review of what we already have

The goal here is not to find mistakes. Most of what we built was the right answer with the tools we had. The goal is to know where our workarounds live, so we can plan upgrades on purpose instead of discovering them during an incident.

A short review, one pass over our services, looking for the patterns from the middle column of the constraint map:

- **Scheduled jobs that poll for state** (“every N minutes, find records waiting for X”) — candidates for durable functions.
- **Chains of queues and state tables** that exist only to remember where a process is.
- **Processes that come close to 15 minutes**, or were split up to stay under it.
- **Adapter layers** that run a web framework (NestJS, Express) inside the event-handler model.
- **Warmers or provisioned concurrency** added to hide cold starts.
- **Functions that mostly wait** on the database or downstream APIs — where CPU-based billing would change the cost.
- **Which region we run in.** Web functions and MicroVMs are not in London yet; if that is where we are, it is a hard constraint for any spike.

For each hit, three lines are enough: what it does, what workaround it uses, and whether the new tool would make it simpler. That list becomes an input for planning, alongside new business ideas such as two-way messaging with pupils.

#### Friction: before fixing it, let's measure it

New tools only help if they remove friction we actually have. And right now we don't know precisely where our delivery friction is — we have impressions, not data.

Grace Briody (Solutions Engineer, Microsoft) made the point with an image: AI gave developers a Lamborghini, but they are still stuck on the M25. Writing code got faster; access, environments, reviews and approvals did not. She uses four words for friction, which give us a shared vocabulary:

| Type | What it feels like | Example |
| --- | --- | --- |
| **Drag** | It works, it just takes longer than it should | Waiting days for access or an environment |
| **Fog** | The right path is unclear | Three docs, two samples and a chat thread disagree |
| **Heat** | The experience erodes trust, so people avoid it | A tool that worked badly once and nobody touches again |
| **Wall** | You simply cannot continue | A build fails for a reason outside your code |

We already have a clean example of a wall: the token for our private npm registry. It expires, builds fail, and only some people can renew it. Nobody did anything wrong — it is just friction that sits outside the code.

**A two-week friction log.** The simplest way to start, no tooling needed:

1. **Everyone logs friction for two weeks** — devs and QA, and product if they want to join. One line per event in a shared table: date, type (drag / fog / heat / wall), roughly how much time was lost, one sentence on what happened.
2. **Pull a few numbers we already have:** time from PR opened to production, how long PRs wait for review, how many builds failed for reasons unrelated to code.
3. **A 30-minute review at the end:** pick the top three, take one into the next sprint.

Two rules from the talks: **don't automate friction** (if a step is pointless, remove it rather than speed it up), and **measure outcomes, not tool usage**.

#### Proposed next steps

All small, all reversible:

- **Review pass** over our services with the checklist above — about an hour, output is a short list.
- **Durable functions spike** on one flow that waits (reminders, confirmations or a polling job): build it in a sandbox account and compare it with the current version.
- **Web functions spike** on a non-critical service or a branch of the API — only once we know our region and how the API is deployed today.
- **Two-week friction log**, then a 30-minute review.
- **MicroVMs:** no action, revisit if a per-PR environment becomes a real need.

Happy to own the review pass and the durable functions spike.

#### Sources

- Workshop notes and code: [MicroVMs_Workshop](https://github.com/leva13007/MicroVMs_Workshop)
- [Lambda durable functions: basic concepts](https://docs.aws.amazon.com/lambda/latest/dg/durable-basic-concepts.html) · [best practices](https://docs.aws.amazon.com/lambda/latest/dg/durable-best-practices.html)
- [Announcing AWS Lambda Web Functions](https://aws.amazon.com/blogs/aws/announcing-aws-lambda-web-functions-for-fast-consistent-web-app-performance-anywhere/) · [What's New, 12 Oct 2026](https://aws.amazon.com/about-aws/whats-new/2026/10/aws-lambda-web-functions/)
- [AWS Lambda introduces MicroVMs](https://aws.amazon.com/blogs/aws/run-isolated-sandboxes-with-full-lifecycle-control-aws-lambda-introduces-microvms/) · [regions update, 22 Oct 2026](https://aws.amazon.com/about-aws/whats-new/2026/10/lambda-microvms-4-additional-regions/)

Talks referenced: Julian Wood (AWS) — Lambda keynote; Gunnar Grosch (Sinch) — conversational agents on durable functions; Grace Briody (Microsoft) — AI across the delivery lifecycle. Quotes and numbers from talks come from machine transcripts.
