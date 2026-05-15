# Context — Ubiquitous Language

This glossary defines the shared vocabulary for Fail Well. Use these terms verbatim in code, tests, commits, and conversation. No implementation details — this is a glossary, not a spec.

## Core terms

### Task

A unit of developer work, planned once and executed at most once. The atomic "thing the developer is doing right now." A Task carries a title, an optional link, a date, and a Plan that may evolve over the course of execution.

### Step

An atomic item inside a Plan. Has a title and a time **Estimation** (minutes). Steps are the granularity at which the developer thinks about and times their work.

### Plan

The ordered list of Steps the developer intends to do. The current Plan may differ from earlier versions — the developer can edit the Plan, and every edit is preserved in **Step History**.

### Step History

The append-only chain of Plan revisions for a Task. The first entry is the **Initial Plan**; the last entry is the current Plan.

### Initial Plan

The Plan version active **at the moment Execution begins** — i.e., the Plan the developer committed to when the first Step Record started. This is the baseline the per-task loop measures against; it is the version that *cannot lie to itself*.

Pre-Execution edits (saving, redrafting, refining before pressing Start) do **not** affect the Initial Plan — those are still planning, not execution. The Initial Plan freezes when contact-with-reality begins, not when the first draft is saved.

### Execution

The single, timed pass through the Plan. Each Task has at most one Execution.

### Step Record

The timed range (start → end) within an Execution for a single Step. Step Records are keyed by Step id, so they survive Plan edits as long as the Step itself does.

## The iteration model — Per-Task Loop

Fail Well is built around a single per-task feedback loop: the developer plans, executes, and compares plan-vs-actual *within one Task*. There is no cross-run comparison — a Task is executed at most once.

Two variance signals exist, with deliberately different framing:

### Failure Signal — variance vs the Initial Plan

The honest signal. "Did my morning self predict correctly?" Computed against **the Initial Plan**, so re-estimating mid-flight cannot silence it. This is the signal the developer learns from — the "fail well" of the product name. Variance here is **not bad**; it is the data the loop produces.

The Failure Signal has three named modes, each a distinct learning vocabulary. The common case (no Re-planning) collapses to the first.

- **Estimation Variance** — for a Step that exists in both the Initial Plan and the Final Plan (identity preserved by id): actual duration minus the Initial Plan's estimation for that Step. *"I underestimated this."*
- **Discovered Scope** — Steps in the Final Plan that were *not* in the Initial Plan. Work the developer added mid-flight because they realised it was missing. *"I didn't foresee this."*
- **Abandoned Scope** — Steps in the Initial Plan that are *not* in the Final Plan (deleted before being executed). Work the developer planned and then decided was unnecessary or wrong-shaped. *"I over-planned."*

### Step-Back Signal — variance vs the latest re-estimate

A softer, real-time signal. When a developer re-estimates a Step mid-execution to reflect new reality, the comparison against that *new* estimate becomes a gentle prompt: *"this is still drifting — take a moment to reconsider."* It is **not framed as failure** — re-estimation is a healthy response to new information, not an admission of bad planning.

### Closing Ceremony

The dedicated end-of-Task moment where the loop closes. Surfaces the Failure Signal in full — per-Step variance against the Initial Plan, total variance, and the shape of any re-planning that happened. The Closing Ceremony is where "fail well" earns the product its name: the failure is named, surfaced, and digested in one place, not hidden behind a single sentence.

### Notes

Free-form text attached to an Execution. Deliberately **dual-purpose**: written *during* execution (capture thoughts as they happen) **and** *after* execution (close the loop with reflection). One textarea, two moments. There is intentionally no separate "reflection field" — the same place catches both.

## Mid-flight edits — two kinds

Editing during Execution is not one operation; it is two, with different weight.

### Re-estimation

Changing a Step's **Estimation** value while the rest of the Plan structure (titles, order, identity) is unchanged. Cheap, frequent, low ceremony. Feeds the Step-Back Signal. Never destroys data.

### Re-planning

Changing the *structure* of the Plan during Execution — adding, removing, reordering, or renaming Steps. **Rare and deliberate.** A re-planning is itself a strong failure signal — the developer is admitting the Plan's shape was wrong, not just its numbers. Re-planning should preserve every Step Record whose Step still exists by identity.
