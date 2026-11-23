# Context — Ubiquitous Language

This glossary defines the shared vocabulary for Fail Well. Use these terms verbatim in code, tests, commits, and conversation. No implementation details — this is a glossary, not a spec.

Fail Well is one app of the [Jitoka](https://git.apoena.dev/julien/jitoka/src/branch/main/CONTEXT.md) platform. **Assignment**, **Team Member** and **Learning** are shared with it; the other terms are Fail Well's own.

## Core terms

### Assignment

One item of work in the hands of one **Team Member**: a Piece or a Rework at one Bluebin Work Station, or work set by hand when it runs in no Line. An Assignment carries a title, an optional link, and a date. Each Team Member who holds it has their own **Plan** of it and at most one **Execution**.

_Avoid_: task, ticket, to-do, Piece (a Piece crosses the whole Line; an Assignment is the part one Team Member does of it)

### Team Member

The person who holds an Assignment and plans, runs and learns from it. Shared with Bluebin.

_Avoid_: developer, user, person, worker

### Step

An atomic item inside a Plan. Has a title and a time **Estimation** (minutes). Steps are the granularity at which the Team Member thinks about and times their work.

### Plan

The ordered list of Steps the Team Member intends to do for one Assignment. The current Plan may differ from earlier versions — the Team Member can edit the Plan, and every edit is preserved in **Step History**.

### Step History

The append-only chain of revisions of one Team Member's Plan of an Assignment. The first entry is the **Initial Plan**; the last entry is the current Plan.

### Initial Plan

The Plan version active **at the moment Execution begins** — i.e., the Plan the Team Member committed to when the first Step Record started. This is the baseline the per-Assignment loop measures against; it is the version that *cannot lie to itself*.

Pre-Execution edits (saving, redrafting, refining before pressing Start) do **not** affect the Initial Plan — those are still planning, not execution. The Initial Plan freezes when contact-with-reality begins, not when the first draft is saved.

An Initial Plan is one Team Member's forecast: no one else ever inherits it.

### Execution

The single, timed pass of one Team Member through their Plan. A Team Member has at most one Execution of an Assignment. When the Assignment goes to another Team Member during the Execution, the Execution closes: its Steps not done count as **Abandoned Scope**, and the new Team Member writes their own Plan.

### Step Record

The timed range (start → end) within an Execution for a single Step. Step Records are keyed by Step id, so they survive Plan edits as long as the Step itself does.

## The iteration model — Per-Assignment Loop

Fail Well is built around a single per-Assignment feedback loop: the Team Member plans, executes, and compares plan-vs-actual *within one Execution*. There is no cross-run comparison — a Team Member executes an Assignment at most once.

Two variance signals exist, with deliberately different framing:

### Failure Signal — variance vs the Initial Plan

The honest signal. "Did my morning self predict correctly?" Computed against **the Initial Plan**, so re-estimating mid-flight cannot silence it. This is the signal the Team Member learns from — the "fail well" of the product name. Variance here is **not bad**; it is the data the loop produces.

The Failure Signal has three named modes, each a distinct learning vocabulary. The common case (no Re-planning) collapses to the first.

- **Estimation Variance** — for a Step that exists in both the Initial Plan and the Final Plan (identity preserved by id): actual duration minus the Initial Plan's estimation for that Step. *"I underestimated this."*
- **Discovered Scope** — Steps in the Final Plan that were *not* in the Initial Plan. Work the Team Member added mid-flight because they realised it was missing. *"I didn't foresee this."*
- **Abandoned Scope** — Steps in the Initial Plan that were never executed: deleted from the Plan, or left undone when the Assignment went to another Team Member. *"I over-planned."*

### Step-Back Signal — variance vs the latest re-estimate

A softer, real-time signal. When a Team Member re-estimates a Step mid-execution to reflect new reality, the comparison against that *new* estimate becomes a gentle prompt: *"this is still drifting — take a moment to reconsider."* It is **not framed as failure** — re-estimation is a healthy response to new information, not an admission of bad planning.

### Closing Ceremony

The dedicated end-of-Execution moment where the loop closes. Surfaces the Failure Signal in full — per-Step variance against the Initial Plan, total variance, and the shape of any re-planning that happened — and is where the Team Member writes the **Learning**. The Closing Ceremony is where "fail well" earns the product its name: the failure is named, surfaced, and digested in one place, not hidden behind a single sentence.

### Notes

Free-form text the Team Member writes *during* the Execution, to capture thoughts as they happen. Raw input: what the Team Member reads when they write the Learning, not the Learning itself.

_Avoid_: reflection, retro note

### Learning

What the Execution taught the Team Member to do better next time, written at its Closing Ceremony. An Execution has at most one Learning. Shared with Jitoka, where Increments and Milestones carry Learnings too.

_Avoid_: lesson, reflection, note, postmortem

## Mid-flight edits — two kinds

Editing during Execution is not one operation; it is two, with different weight.

### Re-estimation

Changing a Step's **Estimation** value while the rest of the Plan structure (titles, order, identity) is unchanged. Cheap, frequent, low ceremony. Feeds the Step-Back Signal. Never destroys data.

### Re-planning

Changing the *structure* of the Plan during Execution — adding, removing, reordering, or renaming Steps. **Rare and deliberate.** A re-planning is itself a strong failure signal — the Team Member is admitting the Plan's shape was wrong, not just its numbers. Re-planning should preserve every Step Record whose Step still exists by identity.

## Who reads what

- A Plan, an Execution and their times belong to the Team Member who holds the Assignment; no one else reads them, a Team Leader included
- Only a Learning the Team Member chooses to share leaves Fail Well, to their Work Station, as text with no times ([Jitoka ADR-0005](https://git.apoena.dev/julien/jitoka/src/branch/main/docs/adr/0005-fail-well-shares-only-the-learnings-a-team-member-chooses.md))

## Flagged ambiguities

- "Task" vs Bluebin **Assignment** — resolved: one concept, called **Assignment**. Bluebin already avoids "task" for a Piece and a Kanban.
- "A Task has at most one Execution" vs Bluebin reassignment — resolved: at most one **Execution** per **Team Member**. An Initial Plan measured against another person's hands would teach nothing.
- **Notes** as "one textarea, two moments" (raw notes and the reflection) — resolved: two things. Notes stay raw input during the Execution; the reflection is the **Learning**, written at the Closing Ceremony, so it can be found and shared on its own.
- **Estimation** and **Re-estimation** (minutes, on a Step) vs Jitoka Original Estimate and Re-estimate (a Week, on a Milestone or an Increment) — resolved: kept apart, one rule at two grains. The first number is the baseline and never moves; a later one only drives the live signal. A Step is never planned in Weeks.
