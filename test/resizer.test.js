import { computeAdjustedSize } from '../src/resizer.js'
import { createTextResizerController } from '../src/controller.js'

// Test if the computed size to increase to is calculated correctly.
test('increases size by one step', () => {
  expect(computeAdjustedSize(14, 2)).toBe(16)
})
// Test if the computed size to decrease to is calculated correctly.
test('decreases size by one step', () => {
  expect(computeAdjustedSize(14, -2)).toBe(12)
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

  test('should not increase text size beyond maxSize', () => {
    p.style.fontSize = '40px' // max value

    const resizer = createTextResizerController({
      selectors: ['#test'],
      step: 2,
      maxSize: 40
    })

    resizer.increase()

    const newSize = window.getComputedStyle(p).fontSize
    expect(newSize).toBe('40px') // not more than maxSize

  })
})

// Test the decrease() function to remove right amount of pixels.
describe('Text Resizer - decrease()', () => {
  let p

  beforeEach(() => {
    document.body.innerHTML = `<p id="test">Hello</p>`
    p = document.getElementById('test')
    p.style.fontSize = '12px'
  })

  test('should decrease text size from 12px to 10px', () => {
    const resizer = createTextResizerController({
      selectors: ['#test'],
      step: 2,
      minSize: 8
    })

    resizer.decrease()

    const newSize = window.getComputedStyle(p).fontSize
    expect(newSize).toBe('10px')
  })

  test('should not decrease text size beyond minSize', () => {
    p.style.fontSize = '8px' // min value

    const resizer = createTextResizerController({
      selectors: ['#test'],
      step: 2,
      minSize: 8
    })

    resizer.decrease()

    const newSize = window.getComputedStyle(p).fontSize
    expect(newSize).toBe('8px') // not more than minSize

  })

})

// Test the decrease() function to remove right amount of pixels.
describe('Text Resizer - min and max', () => {
  let p

  beforeEach(() => {
    document.body.innerHTML = `<p id="test">Hello</p>`
    p = document.getElementById('test')
    p.style.fontSize = '12px'
  })

  test('should set text size to max regardless of initial size', () => {
    const resizer = createTextResizerController({
      selectors: ['#test'],
      step: 2,
      minSize: 8,
      maxSize: 40
    })

    resizer.setTextToMax()

    const newSize = window.getComputedStyle(p).fontSize
    expect(newSize).toBe('40px')
  })

  test('should set text size to min regardless of initial size', () => {
    const resizer = createTextResizerController({
      selectors: ['#test'],
      step: 2,
      minSize: 8,
      maxSize: 40
    })

    resizer.setTextToMin()

    const newSize = window.getComputedStyle(p).fontSize
    expect(newSize).toBe('8px')
  })
})

// Test the decrease() function to remove right amount of pixels.
describe('Text Resizer - restore()', () => {
  let p

  beforeEach(() => {
    document.body.innerHTML = `<p id="test">Hello</p>`
    p = document.getElementById('test')
    p.style.fontSize = '12px'
  })
  test('should restore original size after increases and/or decreases', () => {
    const resizer = createTextResizerController({
      selectors: ['#test'],
      step: 2,
      minSize: 8,
      maxSize: 40
    })

    resizer.increase() // 12 -> 14
    resizer.increase() // 14 -> 16
    resizer.decrease() // 16 -> 14
    resizer.restore() // back to original

    const restoredSize = window.getComputedStyle(p).fontSize
    expect(restoredSize).toBe('12px')
  })
})

// Test the increase() function to target different elements.
describe('Text Resizer - miltiple id:s ', () => {
  let h1, p

  beforeEach(() => {
    document.body.innerHTML = `
      <h1 id="testH1">Header</h1>
      <p id="testP">Paragraph</p>`
    h1 = document.getElementById('testH1')
    p = document.getElementById('testP')
    h1.style.fontSize = '32px'
    p.style.fontSize = '12px'
  })

  test('should increase text size for both h1 and p to different values', () => {
    const resizer = createTextResizerController({
      selectors: ['#testH1', '#testP'],
      step: 2,
      maxSize: 40
    })

    resizer.increase() 

    const newH1Size = window.getComputedStyle(h1).fontSize
    const newPSize = window.getComputedStyle(p).fontSize
    expect(newH1Size).toBe('34px')
    expect(newPSize).toBe('14px')
  })
})

// Test the increase() function to target multiple selectors.
describe('Text Resizer - target elements, class and id ', () => {
  let h1, p, div

  beforeEach(() => {
    document.body.innerHTML = `
      <h1 class="testH1">Header</h1>
      <p>Paragraph</p>
      <div id="textArea">Some text in a div</div>`
    h1 = document.getElementsByClassName('testH1')[0]
    p = document.querySelector('p')
    div = document.getElementById('textArea')
    h1.style.fontSize = '32px'
    p.style.fontSize = '12px'
    div.style.fontSize = '16px'
  })

  test('should increase text size for both h1 and p to different values', () => {
    const resizer = createTextResizerController({
      selectors: ['.testH1', 'p', '#textArea'],
      step: 2,
      maxSize: 40
    })

    resizer.increase() 

    expect(window.getComputedStyle(h1).fontSize).toBe('34px')
    expect(window.getComputedStyle(p).fontSize).toBe('14px')
    expect(window.getComputedStyle(div).fontSize).toBe('18px')
  })
})