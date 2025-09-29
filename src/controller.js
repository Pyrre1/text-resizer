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

  const rawStep = normalizeStep(step)
  const parsedStep = validateStep(rawStep)
  
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

  // Check all selected elements for unit consistency. Sets dominantUnit to the consistant unit or null.
  const dominantUnit = checkUnitConsistency(originalUnits)

  // If there is no consistant unit, convert all to pixels.
  if (dominantUnit === null) {
    convertAllToPixels()
    dominantUnit = 'px'
  } 

  // Check if step unit is same as element unit.
  if (dominantUnit != stepUnit) {
    // If the step unit is different from the elements unit, convert step to element unit.
    convertStepToUnit(stepUnit, dominantUnit, parsedStep)
  } // else units are the same, no conversion needed.


  // The increase text size by one step function.
  function increase() {
    elements.forEach(element => {
      const currentSize = parseFloat(window.getComputedStyle(element).fontSize)
      const newSize = computeAdjustedSize(currentSize, parsedStep)

      const clampedSize = Math.min(newSize, maxSize)
      element.style.fontSize= `${clampedSize}${dominantUnit}`
    })
  }

  // The decrease text size by one step function.
  function decrease() {
    elements.forEach(element => {
      const currentSize = parseFloat(window.getComputedStyle(element).fontSize)
      const newSize = computeAdjustedSize(currentSize, -parsedStep)

      const clampedSize = Math.max(newSize, minSize)
      element.style.fontSize = `${clampedSize}${dominantUnit}`
    })
  }

  // The instant max size function.
  function setTextToMax() {
    elements.forEach(element => {
      element.style.fontSize = `${maxSize}${dominantUnit}`
    })
  }

  // The instant min size function.
  function setTextToMin() {
    elements.forEach(element => {
      element.style.fontSize = `${minSize}${dominantUnit}`
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

  // Sanitizes decimal comma to decimal point for easier parsing.
  function normalizeStep(step) {
    if (typeof step === 'string') {
      return step.replace(',', '.')
    }
    return step
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

  // In case of mixed units, convert all to pixels.
  function convertAllToPixels() {
    elements.forEach(element => {
      const computedSize = window.getComputedStyle(element).fontSize

      if (computedSize !== null) {
        element.style.fontSize = computedSize
        originalTextSizes.set(element, computedSize)
        originalUnits.set(element, 'px')
      }
    })
  }

  function needForConversion(stepUnit, dominantUnit, stepValue) {
    if (stepUnit === dominantUnit) {
      return false
    }

    const isInPixelsOrPercent = ['px', '%'].includes(dominantUnit)
    const isBig = stepValue > 1
    
    if (stepUnit === '_no_unit_') {
      return isInPixelsOrPercent ? !isBig : isBig
    }

    return true // fallback, should not reach here.
  }

  function convertStepToUnit(stepValue, fromUnit, toUnit, elements) {
    // If no unit is given for step, determine if conversion is needed based on target unit and step size.
    if (fromUnit === '_no_unit_') {
      const isAbsolute = ['px', '%'].includes(toUnit)
      const isSmall = stepValue < 1

      if (isAbsolute && isSmall) {
        console.warn(`Step value "${stepValue}" without unit is too small for target unit "${toUnit}". Defaulting to 2px.`)
        return 2
      }

      if (!isAbsolute && !isSmall) {
        console.warn(`Step value "${stepValue}" without unit is too large for target unit "${toUnit}". Recalculating...`)
        return calculateAverageStepMultiplier(elements, stepValue)
      }
      return stepValue // no conversion needed.
    }
    // Converting from px/% to em/rem/vw/vh.
    if (['px', '%'].includes(fromUnit) && ['em', 'rem', 'vw', 'vh'].includes(toUnit)) {
      return calculateAverageStepMultiplier(elements, stepValue)
    }
    // Converting/restoring from em/rem/vw/vh to px/%.
    if (['em', 'rem', 'vw', 'vh'].includes(fromUnit) && ['px', '%'].includes(toUnit)) {
      console.warn(`Converting step from "${fromUnit}" to "${toUnit}" may lead to unexpected results, defaulting to 2px.`)
      return 2
    }
    // In case of units compatible with each other (em/rem or px/%) or unknown units. 
    return stepValue // no conversion needed.
  }

  // Calculate the average multiplier for step conversion based on current sizes of elements.
  function calculateAverageStepMultiplier(elements, stepValue) {
    let totalMultiplier = 0
    let count = 0

    elements.forEach(element => {
      const calculatedPixelValue = parseFloat(window.getComputedStyle(element).fontSize)
      if (!isNaN(calculatedPixelValue) && calculatedPixelValue > 0) {
        const increasedPixelValue = calculatedPixelValue + stepValue
        const multiplier = increasedPixelValue / calculatedPixelValue
        totalMultiplier += multiplier
        count++
      }
    })

    const averageMultiplier = count > 0 ? totalMultiplier / count : 1
    return parseFloat(averageMultiplier.toFixed(2))
  }

  // Check the unit of the step value, if no value is given, return '_no_unit_'.
  function checkStepUnit(step) {
    if (typeof step === 'number') {
      return '_no_unit_'
    }

    const match = step.match(/^(\d+(\.\d+)?)([a-z%]+)$/)
    if (match) {
      return match[3]
    }

    return '_no_unit_' 
  }

  
  // Parsing of step to be able to use it as a integer regardless of if 'px' is added.
  function validateStep(step) {
    if (typeof step === 'number') return step

    const match = step.match(/^(\d+(\.\d+)?)([a-z%]+)$/)
    if (match) return parseFloat(match[1])

    // Changed to console.warn from new Error after lecture.
    console.warn(`Invalid step format: "${step}". Defaulting to 2px.`)
    return 2
  }
}