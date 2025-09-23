import { getTargetElements } from './dom.js'
import { computeAdjustedSize } from './resizer.js'

export function createTextResizerController(config) {
  const {
    selectors = ['p'],
    step = '2px',
    minSize = 6,
    maxSize = 40,
    root = document
  } = config

  const elements = getTargetElements(selectors, root)

  /**
   * Loops through all elements to store the choosen unit format, and original size.
   * 
   */
  const originalTextSizes = new Map()
  const originalUnits = new Map()

  elements.forEach(element => {
    const originalTextSize = window.getComputedStyle(element).fontSize
    const match = originalTextSize.match(/^([\d.]+)([a-z%]+)$/)
    if (match) {
      originalTextSizes.set(element, originalTextSize)
      originalUnits.set(element, match[2])
    }
  })

  const parsedStep = validateStep(step)

  // The increase text size by one step function.
  function increase() {
    elements.forEach(element => {
      const currentSize = parseFloat(window.getComputedStyle(element).fontSize)
      const newSize = computeAdjustedSize(currentSize, parsedStep)

      const clampedSize = Math.min(newSize, maxSize)
      element.style.fontSize= `${clampedSize}px`
    })
  }

  // The decrease text size by one step function.
  function decrease() {
    elements.forEach(element => {
      const currentSize = parseFloat(window.getComputedStyle(element).fontSize)
      const newSize = computeAdjustedSize(currentSize, -parsedStep)

      const clampedSize = Math.max(newSize, minSize)
      element.style.fontSize = `${clampedSize}px`
    })
  }

  // The instant max size function.
  function setTextToMax() {
    elements.forEach(element => {
      element.style.fontSize = `${maxSize}px`
    })
  }

  // The instant min size function.
  function setTextToMin() {
    elements.forEach(element => {
      element.style.fontSize = `${minSize}px`
    })
  }

  // The restore to original size function.
  function restore() {
    elements.forEach(element => {
      const originalSize = originalSizes.get(element)
      if (originalSize) {
        element.style.fontSize = originalSize
      }
    })
  }

  return {
    increase,
    decrease,
    setTextToMax,
    setTextToMin,
    restore
  }


  // Parsing of step to be able to use it as a integer regardless of if 'px' is added.
  function validateStep(step) {
    if (typeof step === 'number') return step

    const match = step.match(/^(\d+)px$/)
    if (match) return parseInt(match[1], 10)

    // Changed to console.warn from new Error after lecture.
    console.warn(`Invalid step format: "${step}". Defaulting to 2px.`)
    return 2
  }
}