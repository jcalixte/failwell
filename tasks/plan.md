# Plan — Align code with the Per-Task Feedback Loop

This plan implements the decisions recorded in [`docs/adr/0001-per-task-feedback-loop.md`](../docs/adr/0001-per-task-feedback-loop.md) and the language in [`CONTEXT.md`](../CONTEXT.md). It closes the inconsistencies surfaced during the deep-design session.

Each slice is vertical: it touches model → store → UI → tests for one user-visible behaviour, rather than refactoring a layer at a time. Phases gate on checkpoints.

## Goals (recap)

1. The Failure Signal compares actual durations against the **Initial Plan**, defined as the Plan version active at the moment Execution begins.
2. Re-planning (mid-Execution structural Plan changes) preserves every Step Record whose Step still exists by id.
3. The loop closes in a dedicated **Closing Ceremony** that names three Failure modes: Estimation Variance, Discovered Scope, Abandoned Scope.
4. Re-estimation (changing a number) and Re-planning (changing the shape) are distinct affordances.

## Dependency graph

```
Phase 1 — Foundation
  ├─ Slice 1 (Initial Plan capture)     ──┐
  └─ Slice 2 (Preserve records on re-plan)─┴─▶ Phase 2

Phase 2 — Closing the loop
  └─ Slice 3 (Closing Ceremony view)      ──▶ Phase 3

Phase 3 — UX split
  └─ Slice 4 (Re-estimation inline / Re-planning modal)  ──▶ Phase 4

Phase 4 — Cleanup
  └─ Slice 5 (Model & naming hygiene)
```

Slice 4 is technically parallelisable with Slice 3 once Slice 2 lands, but is sequenced after Slice 3 to keep the Closing Ceremony available as the source of truth while reshaping the during-Execution UI.

---

## Phase 1 — Foundation

### Slice 1 — Anchor the Initial Plan at Start-of-Execution

**Goal.** The `Recordable` stores the Plan that was active when its first Step Record began. The Failure Signal reads from this snapshot, not from the current Plan.

**Files in scope.**
- `src/modules/record/interfaces/recordable.ts` — add `initialPlan: Stepable[] | null`.
- `src/modules/record/models/task-record.ts` — initialize and round-trip `initialPlan` in `fromRecordable`.
- `src/modules/record/stores/useTaskRecordStore.ts:50-85` — in `startStepRecord`, when `stepRecords` is empty, snapshot `task.steps` into `record.initialPlan` (only if it isn't already set).
- `src/modules/record/components/StepRecord.vue:66-69` — replace `step.value.estimation` with the Initial Plan's estimation for the same Step id; fall back to `step.value.estimation` only when no match.
- `src/modules/record/components/RecordResume.vue:14-20` — total comparison uses sum of Initial Plan estimations, not `task.totalEstimation` (which reflects current Plan).
- `src/modules/record/services/compare-with-estimation.ts` — keep as is (still pure); update its callers.
- Tests: extend `task-record.test.ts`, `compare-with-estimation.test.ts`, and add new unit tests for the snapshot behaviour.

**Acceptance criteria.**
- Pressing Start (first Step Record) captures `task.steps` into `record.initialPlan`. Verified in a unit test against the store.
- Re-estimating a Step during Execution does **not** mutate `record.initialPlan`.
- The "off by 10%" indicator on a Step compares against the Initial Plan's estimation for that Step id.
- Existing persisted records (without `initialPlan`) gracefully fall back to `task.stepHistory[0]`. This fallback path is covered by a unit test.
- `pnpm test` passes (lint + types + unit).

**Manual verification.**
- Create a Task with Steps at 5 / 10 / 10 min.
- Start recording. Re-estimate the first Step to 30 min via the existing edit modal.
- The first row's "off" indicator continues to reference 5 min (not 30) once the Step has elapsed more than ~30 seconds.

**Risks / migration.**
- Persisted localStorage data lacks `initialPlan`. Fallback covers display; new data will populate it. Document the fallback in a code comment.
- `RecordResume` total now diverges from `task.totalEstimation` if Re-planning occurred. Acceptable — see Slice 3 for full surface.

---

### Slice 2 — Preserve Step Records when the Plan changes mid-Execution

**Goal.** Re-planning during Execution never destroys recorded time. Step Records keyed by id survive Plan edits; Steps removed from the Plan keep their orphan records for the Closing Ceremony to inspect.

**Files in scope.**
- `src/modules/record/stores/useTaskRecordStore.ts:193-225` — replace `cleanCurrentStepId` with a non-destructive reconciliation:
  - Find the first Step in the new Plan that has no `end` in the existing records. That becomes the new `currentStepId`.
  - If that Step has no existing record yet, start a new one from the latest end-of-completed-step time (or `Date.now()` if none).
  - **Do not delete** any existing Step Record. Orphan records (no longer in the Plan) remain in `stepRecords`.
- `src/modules/record/stores/useTaskRecordStore.ts:20-39` — `syncTaskRecord` currently wipes the whole record when any recorded Step id is missing from the Plan. Replace with the same non-destructive reconciliation.
- Tests: add scenarios in `useTaskRecordStore.test.ts` (new file if missing) for reorder, delete-in-progress, delete-completed, insert-at-start.

**Acceptance criteria.**
- Reorder during recording — start times of all completed Steps preserved; in-progress Step's start preserved.
- Delete a completed Step during recording — its record is preserved as an orphan in `stepRecords` (still keyed by id, not in current `task.steps`).
- Delete the in-progress Step — its record preserved; the new `currentStepId` is the next un-finished Step in the new Plan.
- Insert a brand-new Step at the start — no existing records mutated; the new Step has no record yet.
- `pnpm test` passes.

**Manual verification.**
- During recording, open the edit modal, reorder steps. After saving, recorded times are unchanged in the table.
- Open browser devtools → Application → Local Storage. Confirm orphan records remain after deleting a Step from the Plan.

**Risks / migration.**
- Orphan records change `stepRecords` from "subset of current Steps" to "history of all Steps that ever had a record." Any consumer that iterates `stepRecords` and assumes membership in `task.steps` must be audited:
  - `RecordResume.vue` → uses `useTaskRecordMetadata` (total duration). Acceptable since orphan time *was* spent.
  - `StepRecord.vue` is rendered per `task.steps[i]`, so it skips orphans naturally.
  - `useTaskRecordMetadata` — audit during this slice.

### CHECKPOINT 1 — after Phase 1

Stop. Verify:
- [ ] `pnpm test` green.
- [ ] Manual smoke: full Task lifecycle (create → record → finish) with Re-estimation and Re-planning mid-flight; localStorage shows preserved `initialPlan` and preserved Step Records.
- [ ] No regression in existing per-Step "off" coloring for un-edited Tasks.

Reviewer (human): confirm Foundation matches `CONTEXT.md` semantics before proceeding to Phase 2.

---

## Phase 2 — Closing the loop

### Slice 3 — Closing Ceremony view (three Failure modes)

**Goal.** A dedicated end-of-Task view that surfaces the three Failure modes, hosts the Notes textarea for post-Execution reflection, and replaces the current adjacent-version diff view at `/task/:id/history`.

**Files in scope.**
- New: `src/modules/record/services/compute-failure-modes.ts` — pure function:
  ```
  computeFailureModes({ initialPlan, finalPlan, stepRecords }) → {
    estimationVariance: Array<{ stepId, title, estimation, actual, deltaMin, isOff }>,
    discoveredScope: Array<{ stepId, title, estimation, actual? }>,
    abandonedScope: Array<{ stepId, title, estimation }>,
    totalActualMin, totalInitialMin, totalDeltaMin
  }
  ```
  with unit tests covering each mode in isolation and combined.
- Rename `src/views/task/TaskHistory.vue` → `TaskClosingCeremony.vue`. Body fully replaced.
- `src/router/index.ts` — repoint the `history-task` route at the new component. Keep the path `/task/:id/history` for backwards-compatibility of bookmarks (rename the route name to `task-closing-ceremony` to match vocabulary).
- `src/modules/record/components/TaskRecord.vue` — when `record.end` is set, surface a "Close the loop" CTA linking to the Closing Ceremony route.
- `src/modules/record/components/RecordResume.vue` — keep the one-line summary as a tease, but defer the rich breakdown to the new view.
- Tests: unit tests on `compute-failure-modes`, component test smoke on `TaskClosingCeremony`.

**Open design questions (resolve during this slice).**
1. How are orphan Step Records (Steps removed from the Plan but with executed time) surfaced? Options: (a) hidden, (b) as a fourth "Discarded Work" section, (c) folded into Abandoned Scope. Default in the plan: **hidden**, with the time still contributing to the totals. Revisit if user feedback contradicts.
2. Does completing a Task auto-navigate to the Closing Ceremony, or is it CTA-only? Default: **CTA-only** — auto-navigation disrupts the during-Execution view if the user is mid-thought. Reflection should be a deliberate transition.

**Acceptance criteria.**
- `computeFailureModes` returns the three buckets correctly given fixture inputs covering: no re-planning (only Estimation Variance), Step added mid-flight (Discovered Scope present), Step deleted from Initial Plan (Abandoned Scope present), all three at once.
- The new view renders all three buckets, hiding empty ones.
- The Notes textarea on the new view binds to the same Pinia field as during-Execution Notes (single source — no duplication).
- The route `/task/:id/history` no longer renders an adjacent-version diff.
- `pnpm test` passes.

**Manual verification.**
- Complete a Task with no Plan changes → only Estimation Variance shown.
- Complete a Task where you added a Step mid-flight → Discovered Scope section appears with that Step.
- Complete a Task where you deleted a planned Step before executing it → Abandoned Scope section appears.
- Notes typed during Execution are visible on the Closing Ceremony view, and edits there persist back.

**Risks / migration.**
- Removing the diff view eliminates a feature, however lightly-used. Acceptable per the deep-design session (declared "dead view").
- Bookmark stability: route path preserved.

### CHECKPOINT 2 — after Phase 2

Stop. Verify:
- [ ] `pnpm test` green.
- [ ] End-to-end loop demoable: create → start → execute → re-plan mid-flight → finish → open Closing Ceremony → three modes correct.

Reviewer (human): confirm the Closing Ceremony surface matches intent before reshaping the during-Execution UI.

---

## Phase 3 — UX split

### Slice 4 — Re-estimation inline; Re-planning deliberate

**Goal.** Re-estimating a Step's number does not require opening the structural-edit modal. Re-planning becomes the modal's explicit purpose with framing that matches its weight.

**Files in scope.**
- `src/modules/record/components/StepRecord.vue` — extend the existing inline-edit pattern (already present for `duration` on completed Steps, see lines around the `isEditing` ref) to cover `estimation` for any Step. Pressing Enter commits; Esc cancels.
- New store action in `useTask.store.ts`: `reEstimateStep({ taskId, stepId, newEstimationMinutes })`. Implementation: push a new entry to `stepHistory` containing the current Plan with only that Step's `estimation` updated. The new entry does **not** disturb `record.initialPlan` (which is already snapshotted per Slice 1).
- `src/modules/task/components/NewStepsForm.vue` — rename heading from "Edit steps" to "Re-plan steps" (or similar weighty phrasing). Update the explanatory text to reflect that this is a structural change. Keep the existing flow for actually adding/removing/reordering.
- `src/modules/record/components/RecordControls.vue:170-176` — the "+" button: relabel/icon-update to "Re-plan" (not "+"); the action is unchanged.
- Tests: store test for `reEstimateStep`; component test for `StepRecord` inline editor.

**Acceptance criteria.**
- Tapping/clicking the estimation cell on a Step row opens an inline editor.
- Committing the edit triggers `reEstimateStep`, which pushes a new `stepHistory` entry.
- `record.initialPlan` is **not** mutated by re-estimation (covered by a unit test).
- The structural-edit modal is now reached only via the explicit "Re-plan" button.
- `pnpm test` passes.

**Manual verification.**
- During recording, click a Step's estimation cell, type a new number, hit Enter. The number updates; no modal opens.
- The Failure Signal (per-Step "off" indicator) continues to reference the Initial Plan estimation.
- Clicking "Re-plan" opens the modal; the heading reflects the new framing.

**Risks / migration.**
- The inline editor needs to coexist with the existing `duration` inline editor on completed Steps. Confirm visual layout supports both without ambiguity.
- Step-Back Signal (variance vs latest re-estimate) is not yet rendered. Surface as a follow-up unless trivial here. Default: render as a secondary, subtler indicator next to the existing "off" color — TBD during implementation.

### CHECKPOINT 3 — after Phase 3

Stop. Verify:
- [ ] `pnpm test` green.
- [ ] Re-estimation is a one-click, one-Enter interaction with no modal.
- [ ] Re-planning still opens the modal with deliberate framing.

Reviewer (human): confirm UX feels right before final cleanup.

---

## Phase 4 — Cleanup

### Slice 5 — Model and naming hygiene

**Goal.** Remove the inconsistencies in the `Task` model and surrounding code that no longer carry their weight after Phases 1-3.

**Files in scope.**
- `src/modules/task/models/task.ts`:
  - Remove `updateSteps` (line 53-56) — identical to `newSteps`. Update test on line 73 (`task.test.ts:73`) to call `newSteps` (or the renamed action — see below).
  - Rename `newSteps` → `rePlan` to match the vocabulary established in `CONTEXT.md`.
  - Keep `editSteps(...steps)` (append semantics) if any consumer needs it; if not, remove. Verify with grep across the codebase before deletion.
  - Fix the `readonly stepHistory` declaration — either drop `readonly` from the constructor parameter (since the array is mutated via `.push()`), or migrate to immutable updates that produce a new array. Recommended: drop `readonly`; document the mutation pattern in CONTEXT.md if non-obvious.
  - Re-examine `wasUpdated` getter: name is misleading (it's `stepHistory.length > 0`, i.e., "has any steps at all"). Rename to `hasSteps` or remove if unused.
- `src/modules/record/stores/useTaskRecordStore.ts`:
  - Rename `cleanCurrentStepId` → `reconcileWithReplannedPlan` (or similar) to match its new non-destructive contract from Slice 2.
- `src/modules/record/models/task-record.ts`:
  - `TaskRecord.start = toISODate(new Date())` at construction is misleading — the real start is set in `startStepRecord` when the first Step Record begins. Initialize as `null` and tighten the type: `start: ISODate | null`. Update consumers.
- `CONTEXT.md`: resolve `Task.link` and `Task.date` semantics. Likely additions:
  - **Task Date**: the moment the Task was created. Used for ordering the Task list. Not editable.
  - **Task Link**: optional external reference (e.g., ticket URL).
- Tests: update all references to renamed methods; add tests for `TaskRecord.start === null` until first Step Record.

**Acceptance criteria.**
- `Task` model has no duplicate-bodied methods.
- All renames propagated; `pnpm test` (lint + types + unit) green.
- `readonly` lies removed.
- `TaskRecord.start` is `null` until the first Step Record begins.
- `CONTEXT.md` includes Task Date and Task Link definitions.

**Manual verification.**
- Smoke the full Task lifecycle one more time to ensure no regressions.

**Risks / migration.**
- Renames touch many files. Use rename-symbol IDE refactors where possible; verify with `pnpm test:types`.

### CHECKPOINT 4 — after Phase 4

Stop. Verify:
- [ ] `pnpm test` green.
- [ ] `pnpm build` succeeds.
- [ ] Manual: full lifecycle smoke once more on a fresh localStorage (incognito tab) to confirm no migration footgun.

---

## Explicitly out of scope (deferred)

These were surfaced in the deep-design session but are not addressed by this plan. They can be picked up in a follow-up plan if value emerges.

- **`breakTime` single-pause model.** Multiple pauses are silently absorbed; the *fact* of pause is unrecoverable. Acceptable for now; the Closing Ceremony does not surface pauses.
- **Step-Back Signal rendering.** Slice 4 mentions surfacing variance vs latest re-estimate as a softer indicator; default behaviour is to render only the Failure Signal until product feedback contradicts.
- **Cross-Task patterns** (e.g., "you underestimate refactors by 40%"). The per-task loop is the focus; cross-task analytics is a separate product surface.

## Test command reference

- `pnpm test` — full (lint + types + unit). Use at every checkpoint.
- `pnpm test:unit` — fast iteration during a slice.
- `pnpm test:types` — type-check only, useful after renames.
- `pnpm dev` — manual UI verification.
- `pnpm vitest run path/to/file.spec.ts` — single test file.
