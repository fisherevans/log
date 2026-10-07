---
title: I want to finish a thought
date: 2026-10-01
description: 'Better AI models change the shape of my work: less waiting, less context switching, and more time to stay focused on the problem.'
tags:
  - opinion
hasVideo: false
featured: true
draft: false
id: SQJhGRrAhB
---
## What changed?

I started using Fable as my daily driver. For the work I’ve been doing, I’ve been getting results I like more than Opus, and I’ve been getting them ***faster***.

What stood out the most was how much more I've enjoyed agentic development with Fable. With a model that’s both capable and fast:

- **I spend less time waiting** for the agent to finish, so I feel less pressure to start something else.
- **I spend less time juggling** multiple threads of work just to keep myself occupied.
- **I spend less time context switching**, remembering where I left off, and reconstructing what I wanted to do next.

The improvement changes the shape of my work. I can stay with a problem, follow a thought, and act on the result while I still have the context in my head. At the end of the day, I feel less "brain-fuzzy" and I have a stronger understanding of what I changed and why.

A lot of agent tooling treats parallelism as the answer to latency. Sometimes it is. But I’m more interested in removing that latency from the work where I’m focused; and, pushing the waiting into the parts of the process that don’t need my active attention..

I want more focus in my day-to-day.

## Working on more things at once

A lot of the conversation around coding agents seems to focus on how much work we can run at once. More sessions. More tasks. More agents coordinating with other agents. Increasingly elaborate tools for managing everything happening in parallel.

I understand the appeal. I generally have somewhere between three and ten active threads of work myself, each with its own agent session. I’ve put effort into tooling that helps me manage them.

But when I’m working through a hard problem, I want to be able to stay with it.

Suppose I’m partway through a change and need a refactor before I can continue. I know what I want to try next. I understand the relevant code. I’m thinking about the behavior we need and the tradeoffs we’re making.

Then the agent needs 30 minutes to churn.

That’s enough time to make sitting there feel wasteful. So I open another session. Or two or three. I check another agent’s output. I start thinking about other problems.

When the first agent finishes, the code might be ready, but my attention has moved. I need to return to the problem, rebuild the context in my head, and remember why the next step mattered.

The agent’s execution time is only part of that delay.

Parallelism helps me make productive use of that waiting time. It doesn’t make the interruption free.

## Speed has to come with capability

A model that responds quickly but needs repeated correction doesn’t help me preserve my focus. I spend the time I saved fixing mistakes, explaining context again, or steering it back toward what I asked for.

The more capable models have changed that experience for me. The jump from pre-`opus-4-6` to `opus-4-6` was the first time I felt like I stopped spending most of my time correcting an agent’s work. More recently, switching to Fable has reduced the other side of the loop: waiting for useful work to come back.

I can make a change, inspect the result, reconsider something, and continue while I’m still thinking about the same problem.

That continuity is valuable to me. It also seems easy to leave out of a comparison spreadsheet.

## What are we actually paying for?

Token prices are concrete. You can compare them. You can put a budget around them.

The cost of repeatedly interrupting someone’s thinking is harder to account for. So is the time spent correcting an agent, reviewing several attempts, or reconstructing context after switching to something else.

I pay for my own usage outside work, and I regularly exhaust my plan. I care about using that budget efficiently.

Over time, I’ve become increasingly convinced that a more expensive model can still be the cheaper tool for me if it reaches a useful result in fewer attempts and consumes less of my attention along the way.

I’m not sure that “value per token” is even the metric I care about most. I care about useful work per dollar, certainly. But I also care about useful work per minute of my own attention.

That’s a suspicion based on my experience, not a cost study.

## Where I want to be involved

There are parts of development where I’m happy to send an agent away and hear from it later.

For me, there’s a useful distinction between working through a problem and getting an agreed change delivered.

Research, design, implementation, and iteration are where I tend to want a close feedback loop. I’m still figuring things out. The result of one step changes what I want to do next.

Waiting for CI checks, tracking approvals, merging, watching a deployment, validating the rollout, and cleaning up are often better candidates for unattended, orchestrated work. There are mechanical parts of that process I would happily stop managing myself.

I want shared tools that handle those steps reliably and ask for my attention when a decision needs it.

What frustrates me is that many attempts I’ve seen to improve the development part seem to accept long waits as the starting point. The proposed solution is to make it easier to work on something else.

That helps me manage the interruption. I’d also like tools that reduce the need for it.

## Your workflow will be different

When I discussed this with other engineers at work, one described almost the reverse of my workflow. They delegate research and implementation, then spend more time working closely with the agent during validation and cleanup.

That seems entirely reasonable. Correctness and minimizing impact during rollout are important parts of this equation. My preference is to make that end of the lifecycle reliable enough that I don’t need to supervise every mechanical step myself.

People differ in where they want to participate and what they trust an agent to handle. I expect our agent workflows to become a lot like our dotfiles: shared tools and dependencies, surrounded by years of personal preferences and customizations.

I don’t expect everyone to want the same workflow I do.

## What are we trying to scale?

When discussing this topic at work, I was asked: "how would you scale this approach if you needed to ship twenty or fifty times more pull requests?"

I’m doubtful that my brain could manage that many more independent problems. I’m also unconvinced that this is the outcome I should be designing my work around.

Routine dependency updates, vulnerability fixes, and feature flag removal seem like things shared engineering systems could increasingly own. I hope we automate that work well enough that each engineer doesn’t need to personally supervise an expanding collection of agents doing it.

There’s a difference between scaling how much implementation machinery I can supervise and scaling how effectively I can apply my judgment.

My employer pays me to understand problems, make decisions, and help ensure that what we’re building is what we should be building. PR counts, attributed deployments, and lines of code are only fragments of that process. Yet those are some of the primary metrics I see quoted when people justify or critique AI spend.

They tell you very little about how much value was actually delivered, or how effectively I used my time and attention.

## What I want back

When I think about where my career might go over the coming years, I hope more of my time goes toward product behavior and system design. I want to think about what someone needs, how a system should behave, and whether the proposed change actually helps.

I don't want AI to help me keep fifty independent threads in my head.

I want it to make more of those threads unnecessary.

I want the routine work to require less attention. I want the difficult work to receive more of it.

I want to focus on one hard problem at a time.
