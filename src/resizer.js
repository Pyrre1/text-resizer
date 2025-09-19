// Calculates the size to adjust to
// Changed from up/down for DRY, and use negative stepValue for smaller text size.
export function computeAdjustedSize(currentSize, stepValue) {
  return currentSize + stepValue
}
