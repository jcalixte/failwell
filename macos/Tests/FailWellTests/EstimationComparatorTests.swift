import Testing
@testable import FailWell

@Suite("EstimationComparator")
struct EstimationComparatorTests {
    @Test func flagsDurationsMoreThan10PercentOff() {
        // From `compare-with-estimation.test.ts`.
        #expect(EstimationComparator.is10PercentOff(estimation: 10, duration: 9) == false)
        #expect(EstimationComparator.is10PercentOff(estimation: 5, duration: 4) == false)
        #expect(EstimationComparator.is10PercentOff(estimation: 10, duration: 5) == true)
        #expect(EstimationComparator.is10PercentOff(estimation: 10, duration: 8) == true)
    }
}
