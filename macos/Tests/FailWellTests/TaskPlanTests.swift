import Testing
@testable import FailWell

@Suite("TaskPlan — Initial Plan baseline")
struct TaskPlanTests {
    @Test func initialEstimationReturnsInitialPlanValueAfterReestimation() {
        // CONTEXT.md §"Failure Signal" — the honest baseline is the Initial Plan,
        // even after the developer re-estimates mid-Execution.
        let initialSteps = StepParser.adaptTextareaToSteps("- refactor parser | 5")
        var task = TaskPlan(id: "t1", title: "Test", stepHistory: [initialSteps])

        // Re-estimate: same title, new estimation → same Step id, new Step entry.
        let reestimated = StepParser.adaptTextareaToSteps("- refactor parser | 12")
        task.newSteps(reestimated)

        let stepId = task.steps[0].id
        #expect(initialSteps[0].id == stepId) // identity preserved across re-estimation
        #expect(task.steps[0].estimation == 12) // current Plan reflects the new number
        #expect(task.initialEstimation(for: stepId) == 5) // baseline reflects the commitment
    }

    @Test func initialEstimationReturnsNilForStepsAddedMidExecution() {
        let initialSteps = StepParser.adaptTextareaToSteps("- planned step | 5")
        var task = TaskPlan(id: "t1", title: "Test", stepHistory: [initialSteps])

        let addedLater = StepParser.adaptTextareaToSteps("""
        - planned step | 5
        - unplanned step | 3
        """)
        task.newSteps(addedLater)

        let addedStepId = task.steps[1].id
        #expect(task.initialEstimation(for: addedStepId) == nil) // no baseline → no Failure Signal
    }

    @Test func failureSignalFiresAgainstInitialPlanNotCurrent() {
        // Scenario from the CONTEXT.md challenge: planned 5m, drifted, re-estimated to 12m,
        // finished at 12m. Honest signal must fire because we missed the *original* commitment.
        let initialSteps = StepParser.adaptTextareaToSteps("- step | 5")
        var task = TaskPlan(id: "t1", title: "Test", stepHistory: [initialSteps])
        task.newSteps(StepParser.adaptTextareaToSteps("- step | 12"))

        let stepId = task.steps[0].id
        let baseline = task.initialEstimation(for: stepId)!
        let actualMinutes = 12.0

        #expect(EstimationComparator.is10PercentOff(estimation: Double(baseline), duration: actualMinutes) == true)
        // Confirm the silent-signal bug: comparing against the *current* (re-estimated) value would hide it.
        #expect(EstimationComparator.is10PercentOff(estimation: Double(task.steps[0].estimation), duration: actualMinutes) == false)
    }
}
