import { is10PercentOffThanEstimation } from '@/modules/record/services/compare-with-estimation'
import { describe, expect, it } from 'vitest'

describe('compareWithEstimation', () => {
  it('should tells if the estimation is off by 10% or more', () => {
    expect(is10PercentOffThanEstimation({ estimation: 10, duration: 9 })).toBe(
      false
    )
    expect(is10PercentOffThanEstimation({ estimation: 5, duration: 4 })).toBe(
      false
    )
    expect(is10PercentOffThanEstimation({ estimation: 10, duration: 5 })).toBe(
      true
    )
    expect(is10PercentOffThanEstimation({ estimation: 10, duration: 8 })).toBe(
      true
    )
  })
})
