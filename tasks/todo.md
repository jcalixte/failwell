# Todo — Per-Task Feedback Loop alignment

Flat task list for execution. Detailed acceptance criteria, files, and verification steps live in [`plan.md`](./plan.md). Tick items as you complete them; pause at each **Checkpoint** for review before continuing.

## Phase 1 — Foundation

### Slice 1 — Initial Plan capture

- [ ] Add `initialPlan: Stepable[] | null` to `Recordable` interface
- [ ] Round-trip `initialPlan` in `TaskRecord.fromRecordable`
- [ ] In `startStepRecord`, snapshot `task.steps` into `record.initialPlan` when `stepRecords` is empty and `initialPlan` is not yet set
- [ ] Add fallback to `task.stepHistory[0]` when `record.initialPlan` is missing (legacy data)
- [ ] Replace `step.value.estimation` with Initial Plan lookup in `StepRecord.vue` "off by 10%" computation
- [ ] Update `RecordResume.vue` total comparison to sum Initial Plan estimations
- [ ] Add unit tests: snapshot occurs on first Step Record; re-estimation does not mutate `initialPlan`; legacy fallback works
- [ ] `pnpm test` green
- [ ] Manual verification per `plan.md` Slice 1

### Slice 2 — Preserve records on re-planning

- [ ] Audit consumers of `record.stepRecords` for "step is in current Plan" assumptions
- [ ] Replace `cleanCurrentStepId` with non-destructive reconciliation: never delete records, only set the new `currentStepId`
- [ ] Replace destructive `syncTaskRecord` body with the same non-destructive reconciliation
- [ ] Add unit tests for reorder, delete-completed, delete-in-progress, insert-at-start
- [ ] `pnpm test` green
- [ ] Manual verification per `plan.md` Slice 2

### ✋ Checkpoint 1 — Foundation review

- [ ] Full test suite green
- [ ] Manual smoke: full Task lifecycle with re-estimation and re-planning
- [ ] Reviewer (human) confirms Foundation matches `CONTEXT.md` semantics

---

## Phase 2 — Closing the loop

### Slice 3 — Closing Ceremony view

- [ ] Implement pure `computeFailureModes({ initialPlan, finalPlan, stepRecords })` service
- [ ] Unit tests for all three modes in isolation and combined
- [ ] Decide: orphan record handling (default: hidden, time still totalled)
- [ ] Decide: auto-navigate to ceremony on Task completion (default: CTA-only)
- [ ] Rename `TaskHistory.vue` → `TaskClosingCeremony.vue`; replace body
- [ ] Update router: route name → `task-closing-ceremony`; path preserved
- [ ] Add "Close the loop" CTA in `TaskRecord.vue` when `record.end` is set
- [ ] Trim `RecordResume.vue` to a one-line tease
- [ ] Bind ceremony Notes textarea to the same Pinia field as during-Execution Notes
- [ ] Component smoke test on `TaskClosingCeremony`
- [ ] `pnpm test` green
- [ ] Manual verification: each of the three modes per `plan.md` Slice 3

### ✋ Checkpoint 2 — Closing Ceremony review

- [ ] Full test suite green
- [ ] End-to-end loop demo: create → start → re-plan mid-flight → finish → open Ceremony → three modes correct
- [ ] Reviewer (human) confirms Ceremony surface matches intent

---

## Phase 3 — UX split

### Slice 4 — Re-estimation inline / Re-planning modal

- [ ] Add `reEstimateStep({ taskId, stepId, newEstimationMinutes })` action to task store
- [ ] Push a new `stepHistory` entry on re-estimation (Plan structure unchanged, only the number)
- [ ] Confirm via unit test that `record.initialPlan` is unaffected by re-estimation
- [ ] Extend inline-edit pattern in `StepRecord.vue` to cover the `estimation` cell on any Step
- [ ] Inline editor commits on Enter, cancels on Esc
- [ ] Rename modal heading to "Re-plan steps" (or similar); update explanatory text
- [ ] Relabel the "+" button in `RecordControls.vue` to "Re-plan"
- [ ] Component test for inline estimation editor
- [ ] Decide where the Step-Back Signal renders (default: deferred, see Out-of-Scope in plan)
- [ ] `pnpm test` green
- [ ] Manual verification per `plan.md` Slice 4

### ✋ Checkpoint 3 — UX review

- [ ] Full test suite green
- [ ] Re-estimation is one-click + Enter, no modal
- [ ] Re-planning opens modal with deliberate framing
- [ ] Reviewer (human) confirms UX matches intent

---

## Phase 4 — Cleanup

### Slice 5 — Model and naming hygiene

- [ ] Grep for `updateSteps`, remove method (identical to `newSteps`), update tests
- [ ] Rename `newSteps` → `rePlan` on `Task`
- [ ] Grep for `editSteps` (append semantics): remove if unused, keep otherwise
- [ ] Drop `readonly` from the `stepHistory` constructor parameter on `Task`
- [ ] Re-examine `wasUpdated`: rename to `hasSteps` or remove if unused
- [ ] Rename `cleanCurrentStepId` → `reconcileWithReplannedPlan` (or similar)
- [ ] Tighten `TaskRecord.start` type to `ISODate | null`; initialize as `null`
- [ ] Update all consumers of `TaskRecord.start` to handle `null` (until first Step Record)
- [ ] Update `CONTEXT.md`: define `Task Date` and `Task Link`
- [ ] `pnpm test:types` after renames
- [ ] `pnpm test` green
- [ ] `pnpm build` succeeds

### ✋ Checkpoint 4 — Final review

- [ ] Full test suite green
- [ ] `pnpm build` succeeds
- [ ] Fresh-localStorage smoke (incognito) — no migration footgun
- [ ] Plan considered complete

---

## Out of scope (parked)

- `breakTime` single-pause model
- Cross-Task pattern analytics
- Step-Back Signal rendering (decided per-slice; default deferred)
