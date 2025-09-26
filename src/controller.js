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

  const parsedStep = validateStep(step)
  
    /**
   * Get all target elements based on provided selectors within the specified root.
   * 
   * @constant {Element[]} elements - Array of target elements to be resized.
   */
  const elements = getTargetElements(selectors, root)

    /**
   * Stores the original size and units for each target element.
   * This enables unit-aware resizing without forcing convertion to one unit.
   * 
   * example stored values:
   * - element: <p>, originalTextSize: "1.2em", unit: "em"
   * - element: <h1>, originalTextSize: "18px", unit: "px"
   * 
   * @constant {Map<Element, string>} originalTextSizes - Map of elements to their original font sizes.
   * @constant {Map<Element, string>} originalUnits - Map of elements to their original units.
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

  // Check the unit for step value.
  const stepUnit = checkStepUnit(step)

  // Check all selected elements for unit consistency.
  const unit = checkUnitConsistency(originalUnits)

  // If there is no consistant unit, convert all to pixels.
  if (unit === null) {
    convertAllToPixels()
    unit = 'px'
  } 

  // Check if step unit is same as element unit.
  if (unit != stepUnit) {
    // If the step unit is different from the elements unit, convert step to element unit.
    convertStepToUnit(stepUnit, unit)
  } // else units are the same, no conversion needed.


  // The increase text size by one step function.
  function increase() {
    elements.forEach(element => {
      const currentSize = parseFloat(window.getComputedStyle(element).fontSize)
      const newSize = computeAdjustedSize(currentSize, parsedStep)

      const clampedSize = Math.min(newSize, maxSize)
      element.style.fontSize= `${clampedSize}${unit}`
    })
  }

  // The decrease text size by one step function.
  function decrease() {
    elements.forEach(element => {
      const currentSize = parseFloat(window.getComputedStyle(element).fontSize)
      const newSize = computeAdjustedSize(currentSize, -parsedStep)

      const clampedSize = Math.max(newSize, minSize)
      element.style.fontSize = `${clampedSize}${unit}`
    })
  }

  // The instant max size function.
  function setTextToMax() {
    elements.forEach(element => {
      element.style.fontSize = `${maxSize}${unit}`
    })
  }

  // The instant min size function.
  function setTextToMin() {
    elements.forEach(element => {
      element.style.fontSize = `${minSize}${unit}`
    })
  }

  // The restore to original size function.
  function restore() {
    elements.forEach(element => {
      const originalSize = originalTextSizes.get(element)
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

  /**
   * Checks that all elements share the same font-size unit.
   * 
   * @param {Map<Element, string>} originalUnits - Map of elements to their units.
   * @return {boolean} - Returns the consistant unit, otherwise null.
   */
  function checkUnitConsistency(originalUnits) {
    const units = new Set()
    originalUnits.forEach(unit => {
      units.add(unit)
    })
    return units.size === 1 ? [...units][0] : null
  }

  // Check the unit of the step value, if no value is given, default to 'px'.
  function checkStepUnit(step) {

    if (typeof step === 'number') return 'px'

    const match = step.match(/^(\d+)([a-z%]+)$/)
    if (match) return match[2]
    return 'px' // Default to 'px' if no unit found.
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