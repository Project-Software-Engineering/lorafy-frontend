export function roundToDecimals(number, decimals = 2) {
  const multiplier = 10 ** decimals;
  return Math.round((number + Number.EPSILON) * multiplier) / multiplier;
}
