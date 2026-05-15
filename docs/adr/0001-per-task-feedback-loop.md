---
status: accepted
---

# Per-Task Feedback Loop — Initial Plan baseline, three failure modes, and a Closing Ceremony

## Context

Fail Well exists to support a per-task feedback loop: a developer plans, executes, and learns from the variance — within a single execution of a single Task. The product's name commits to the framing that variance is data, not failure-to-avoid. For that framing to be honest, the loop needs a baseline that cannot be edited away mid-flight, and a moment where the loop visibly closes.

When this ADR was written, the code did *not* match that intent: per-Step variance was computed against the *current* Plan (so re-estimation mid-flight silenced the signal), `stepHistory[0]` (the first save, possibly a brainstorming draft) was treated as the baseline, mid-flight Plan edits could silently destroy Step Records, and the post-Execution UI was a single colored sentence with no dedicated reflection surface.

## Decision

The per-task feedback loop is defined by four coupled commitments:

1. **Initial Plan is anchored at Start-of-Execution**, not at first save. The Initial Plan is the Plan version active at the moment the first Step Record begins. Pre-Execution drafting does not pollute the baseline.

2. **The Failure Signal compares against the Initial Plan**, with three named modes:
   - **Estimation Variance** — for Steps present in both Initial and Final Plan: actual duration minus Initial Plan estimation.
   - **Discovered Scope** — Steps added to the Final Plan that were not in the Initial Plan ("work I didn't foresee").
   - **Abandoned Scope** — Steps in the Initial Plan that were never executed ("work I over-planned").

   Variance against the *latest* re-estimate is preserved as a separate, softer **Step-Back Signal** — a real-time prompt to reconsider, not framed as failure.

3. **Re-estimation and Re-planning are distinct operations.** Re-estimation (changing a Step's `estimation` number, Plan structure unchanged) is cheap, frequent, and non-destructive. Re-planning (add / delete / reorder / rename Steps) is deliberate and rare — it is itself a strong failure-mode signal. Re-planning must preserve every Step Record whose Step still exists by id; orphan-or-destroy behaviour is incompatible with the loop.

4. **The loop closes in a dedicated Closing Ceremony** — a real end-of-Task surface that names the three failure modes, surfaces the Initial-vs-Final Plan shape if Re-planning happened, and hosts the Notes textarea as the reflection input. The existing plan-version archaeology view is replaced by this ceremony; intermediate `stepHistory` entries remain in the data model but are not the primary artifact rendered.

## Consequences

- The `TaskRecord` (or equivalent) must capture the Initial Plan at Execution start — `stepHistory[0]` alone is no longer sufficient.
- `cleanCurrentStepId` and the mid-Execution edit flow must be redesigned around the Re-estimation / Re-planning split.
- The single `NewStepsForm` modal currently used for initial drafting, mid-flight edits, and (transitively) the Re-estimation / Re-planning conflation must be split into distinct affordances.
- The Closing Ceremony view replaces `TaskHistory.vue`'s current adjacent-version diff behaviour.

## Considered alternatives

- **Compare against the latest Plan** (status quo): rejected — silences the signal on re-estimation, defeats the loop's purpose.
- **First-appearance baseline** (each Step compares against the version it first appeared in): rejected — blurs what "Initial Plan" means and loses the Discovered / Abandoned Scope vocabulary.
- **Totals-only comparison when Re-planning occurs**: rejected — loses per-Step diagnostic value precisely in the cases where the loop produces the most learning.
- **Intentional minimalism** (no Closing Ceremony, raw numbers only): rejected — the product's name commits to a named, surfaced failure; one colored sentence does not deliver that.
