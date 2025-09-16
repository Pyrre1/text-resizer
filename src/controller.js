import { getTargetElements } from './dom.js'
import { computeIncreasedSize } from './resizer.js'

export function createTextResizerController(config) {
  const {
    selectors = ['p'],
    step = '2px',
    minSize = 6,
    maxSize = 40,
    root = document
  } = config

  const elements = getTargetElements(selectors, root)

  const originalSizes = new Map()

  elements.forEach(element => {
    const originalSize = window.getComputedStyle(element).fontSize
    originalSizes.set(element, originalSize)
  })

  // The increase text size by one step function.
  function increase() {
    elements.forEach(element => {
      const currentSize = parseFloat(window.getComputedStyle(element).fontSize)
      const newSize = computeIncreasedSize(currentSize, step)

      const clampedSize = Math.min(newSize, maxSize)
      element.style.fontSize= `${clampedSize}px`
    })
  }

  return {
    increase
  }
}