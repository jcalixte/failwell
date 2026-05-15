import Testing
@testable import FailWell

@Suite("StepParser")
struct StepParserTests {
    @Test func adaptsStepsToTextarea() {
        let steps = [
            Step(id: "a", title: "step 1", estimation: 3),
            Step(id: "b", title: "step 2", estimation: 4),
            Step(id: "c", title: "step 3", estimation: 5)
        ]
        #expect(StepParser.adaptStepsToTextarea(steps) == "- step 1 | 3\n- step 2 | 4\n- step 3 | 5")
    }

    @Test func parsesTextareaIntoSteps() {
        let input = """
        - step 1 | 3
        - step 2 | 4
        - step 3 | 5
        """
        let steps = StepParser.adaptTextareaToSteps(input)
        #expect(steps.map(\.title) == ["step 1", "step 2", "step 3"])
        #expect(steps.map(\.estimation) == [3, 4, 5])
    }

    @Test func fallsBackToZeroWhenNoEstimation() {
        let steps = StepParser.adaptTextareaToSteps("- step 1")
        #expect(steps.count == 1)
        #expect(steps[0].title == "step 1")
        #expect(steps[0].estimation == 0)
    }

    @Test func fallsBackToZeroWhenEstimationUnparseable() {
        let steps = StepParser.adaptTextareaToSteps("- step 1 | not an estimation")
        #expect(steps.count == 1)
        #expect(steps[0].title == "step 1")
        #expect(steps[0].estimation == 0)
    }

    @Test func skipsEmptyTitles() {
        let steps = StepParser.adaptTextareaToSteps("\n-")
        #expect(steps.isEmpty)
    }

    @Test func generatesStableIdsFromTitleAlone() {
        // Step identity is title-only (md5(title) + duplicate suffix). Re-estimating
        // the same title must yield the same id so the Step Record survives.
        let single = StepParser.adaptTextareaToSteps("- step 1 | 3")
        #expect(single.first?.id == "7eedced2241bcccda700ccac1b5915d6-1")

        let duped = StepParser.adaptTextareaToSteps("""
        - step duplicated | 3
        - step duplicated | 3
        """)
        #expect(duped.map(\.id) == [
            "b53d37cc4caaf9d8d4f1e459e335a242-1",
            "b53d37cc4caaf9d8d4f1e459e335a242-2"
        ])
    }

    @Test func reestimationPreservesStepIdentity() {
        // CONTEXT.md §"Re-estimation": changing the estimation never destroys data.
        // Same title with different estimations must produce the same Step id.
        let original = StepParser.adaptTextareaToSteps("- refactor parser | 5")
        let reestimated = StepParser.adaptTextareaToSteps("- refactor parser | 12")
        #expect(original.first?.id == reestimated.first?.id)
        #expect(original.first?.estimation == 5)
        #expect(reestimated.first?.estimation == 12)
    }

    @Test func parsesUncheckedCheckboxes() {
        let steps = StepParser.adaptTextareaToSteps("- [ ] step with checkbox | 20")
        #expect(steps.count == 1)
        #expect(steps[0].title == "step with checkbox")
        #expect(steps[0].estimation == 20)
    }

    @Test func parsesCheckedCheckboxes() {
        let steps = StepParser.adaptTextareaToSteps("- [x] completed step | 15")
        #expect(steps.count == 1)
        #expect(steps[0].title == "completed step")
        #expect(steps[0].estimation == 15)
    }

    @Test func parsesCheckboxesWithoutEstimation() {
        let steps = StepParser.adaptTextareaToSteps("- [ ] step without estimation")
        #expect(steps.count == 1)
        #expect(steps[0].title == "step without estimation")
        #expect(steps[0].estimation == 0)
    }

    @Suite("subtask support")
    struct SubtaskTests {
        @Test func flattensIndentedSubtasksWithParentPrefix() {
            let input = """
            - Parent task | 5
              - Child task 1 | 3
              - Child task 2 | 2
            """
            let steps = StepParser.adaptTextareaToSteps(input)
            #expect(steps.map(\.title) == ["(Parent task) - Child task 1", "(Parent task) - Child task 2"])
            #expect(steps.map(\.estimation) == [3, 2])
        }

        @Test func ignoresParentEstimationWhenItHasChildren() {
            let steps = StepParser.adaptTextareaToSteps("""
            - Parent | 10
              - Child | 3
            """)
            #expect(steps.count == 1)
            #expect(steps[0].title == "(Parent) - Child")
            #expect(steps[0].estimation == 3)
        }

        @Test func treatsStandaloneItemsAsRegularSteps() {
            let steps = StepParser.adaptTextareaToSteps("- Standalone task | 4")
            #expect(steps.count == 1)
            #expect(steps[0].title == "Standalone task")
            #expect(steps[0].estimation == 4)
        }

        @Test func handlesMixedSubtasksAndStandaloneItems() {
            let input = """
            - Parent task | 5
              - Child task 1 | 3
              - Child task 2 | 2
            - Standalone | 4
            """
            let steps = StepParser.adaptTextareaToSteps(input)
            #expect(steps.map(\.title) == [
                "(Parent task) - Child task 1",
                "(Parent task) - Child task 2",
                "Standalone"
            ])
            #expect(steps.map(\.estimation) == [3, 2, 4])
        }

        @Test func handlesTabIndentation() {
            let steps = StepParser.adaptTextareaToSteps("- Parent | 5\n\t- Child | 3")
            #expect(steps.count == 1)
            #expect(steps[0].title == "(Parent) - Child")
        }

        @Test func treatsOrphanIndentedLineAsRegularStep() {
            let steps = StepParser.adaptTextareaToSteps("  - Orphan indented | 3")
            #expect(steps.count == 1)
            #expect(steps[0].title == "Orphan indented")
            #expect(steps[0].estimation == 3)
        }

        @Test func handlesMultipleParentsWithChildren() {
            let input = """
            - Parent 1 | 5
              - Child 1a | 2
              - Child 1b | 3
            - Parent 2 | 4
              - Child 2a | 1
            """
            let steps = StepParser.adaptTextareaToSteps(input)
            #expect(steps.map(\.title) == [
                "(Parent 1) - Child 1a",
                "(Parent 1) - Child 1b",
                "(Parent 2) - Child 2a"
            ])
        }
    }
}
