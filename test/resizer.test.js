import { computeIncreasedSize } from '../src/resizer.js'

// Test if the computed size to increase to is calculated correctly.
test('increases size by one step', () => {
  expect(computeIncreasedSize(14, 2)).toBe(16)
})
