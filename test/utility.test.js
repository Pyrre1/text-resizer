import { createTextResizerController } from '../src/controller.js'


// Test the increase() function to add right amount of pixels.
describe('Text Resizer - increase() -different units', () => {
  let p
  let h1
  let div

  beforeEach(() => {
    document.body.innerHTML = `
      <h1 id="header">Header</h1>
      <p id="test">Hello</p>
      <div id="test2">World</div>`
    h1 = document.getElementById('header')
    p = document.getElementById('test')
    div = document.getElementById('test2')
    p.style.fontSize = '12px'
    h1.style.fontSize = '2rad'
    div.style.fontSize = '16%'
  })

  test('should convert all units to pixels, and add 2px to each element', () => {
    const resizer = createTextResizerController({
      selectors: ['#test', '#header', '#test2'],
      step: 2,
      maxSize: 40
    })

    resizer.increase()

    const newSize = window.getComputedStyle(p).fontSize
    expect(newSize).toBe('14px')
  })
})

describe('Text Resizer - increase() - em unit and em step', () => { 
  let p

  beforeEach(() => {
    document.body.innerHTML = `<p id="test">Hello</p>`
    p = document.getElementById('test')
    p.style.fontSize = '1.2em'
  })

  test('should increase text size from 1.2em to 1.4em', () => {
    const resizer = createTextResizerController({
      selectors: ['#test'],
      step: '0.2em',
      maxSize: '4em'
    })

    const beforePixelSize = parseFloat(window.getComputedStyle(p).fontSize)
    resizer.increase()
    const newPixelSize = parseFloat(window.getComputedStyle(p).fontSize)

    expect(newPixelSize).toBeGreaterThan(beforePixelSize)
  })

  test('should not break due to , instead of .', () => {
    const resizer = createTextResizerController({
      selectors: ['#test'],
      step: '0,2em',
      maxSize: '4em'
    })

    const beforePixelSize = parseFloat(window.getComputedStyle(p).fontSize)
    resizer.increase()
    const newPixelSize = parseFloat(window.getComputedStyle(p).fontSize)

    expect(newPixelSize).toBeGreaterThan(beforePixelSize)
  })

  test('should handle step "out of bounds" for relative units calculate step from assumed px step value', () => {
    const resizer = createTextResizerController({
      selectors: ['#test'],
      step: '2',
      maxSize: '4em'
    })

    const beforePixelSize = parseFloat(window.getComputedStyle(p).fontSize)
    resizer.increase()
    const newPixelSize = parseFloat(window.getComputedStyle(p).fontSize)

    expect(newPixelSize).toBeGreaterThan(beforePixelSize)
  })
})

describe('should handle step "out of bounds" for px defaulting to 2px', () => {
  let p

  beforeEach(() => {
    document.body.innerHTML = `<p id="test">Hello</p>`
    p = document.getElementById('test')
    p.style.fontSize = '12px'
  })

  test('should set default value for step to 2px if < 1', () => {
    const resizer = createTextResizerController({
      selectors: ['#test'],
      step: 0.2,
      maxSize: 40
    })

    resizer.increase()

    const newSize = window.getComputedStyle(p).fontSize
    expect(newSize).toBe('14px')
  })

  test('should set default value for step to 2px if < 1, even if written as 0,2', () => {
    const resizer = createTextResizerController({
      selectors: ['#test'],
      step: '0,2',
      maxSize: 40
    })

    resizer.increase()

    const newSize = window.getComputedStyle(p).fontSize
    expect(newSize).toBe('14px')
  })
})