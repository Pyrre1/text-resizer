import { computeIncreasedSize } from '../src/resizer.js'
import { createTextResizerController } from '../src/controller.js'

// Test if the computed size to increase to is calculated correctly.
test('increases size by one step', () => {
  expect(computeIncreasedSize(14, 2)).toBe(16)
})

// Test the increase() function to add right amount of pixels.
describe('Text Resizer - increase()', () => {
  let p

  beforeEach(() => {
    document.body.innerHTML = `<p id="test">Hello</p>`
    p = document.getElementById('test')
    p.style.fontSize = '12px'
  })

  test('should increase text size from 12px to 14px', () => {
    const resizer = createTextResizerController({
      selectors: ['#test'],
      step: 2,
      maxSize: 40
    })
    
    resizer.increase()

    const newSize = window.getComputedStyle(p).fontSize
    expect(newSize).toBe('14px')
  })
})