export const is10PercentOffThanEstimation = ({
  estimation,
  duration
}: {
  estimation: number
  duration: number
}) => {
  return Math.abs(duration - estimation) > Math.max(estimation * 0.1, 1)
}
