import { createTextResizerController } from '../src/controller.js'


// Test the increase() function to add right amount of pixels.
describe('Utility test - increase() -different units', () => {
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

  test('Utility test - convert multiple units to uniform unit (pixels)', () => {
    const resizer = createTextResizerController({
      selectors: ['#test', '#header', '#test2'],
      step: 2,
      maxSize: 40
    })

    const headerSizeBefore = parseFloat(window.getComputedStyle(h1).fontSize)
    const divSizeBefore = parseFloat(window.getComputedStyle(div).fontSize)
    resizer.increase()
    const headerSizeAfter = parseFloat(window.getComputedStyle(h1).fontSize)
    const divSizeAfter = parseFloat(window.getComputedStyle(div).fontSize)

    const newSize = window.getComputedStyle(p).fontSize
    expect(newSize).toBe('14px')
    expect(headerSizeAfter).toBeGreaterThan(headerSizeBefore)
    expect(divSizeAfter).toBeGreaterThan(divSizeBefore)
  })
})

describe('Utility test - increase() - relative units and relative step', () => {
  let p

  beforeEach(() => {
    document.body.innerHTML = `<p id="test">Hello</p>`
    p = document.getElementById('test')
    p.style.fontSize = '1.2em'
  })

  test('Utility test - increase text size  relative units (em)', () => {
    const resizer = createTextResizerController({
      selectors: ['#test'],
      step: '0.2em',
      maxSize: '4em'
    })

    resizer.increase()

    expect(p.style.fontSize).toBe('1.4em')
  })

  test('Utility test - convert comma as decimal', () => {
    const resizer = createTextResizerController({
      selectors: ['#test'],
      step: '0,2em',
      maxSize: '4em'
    })

    resizer.increase()

    expect(p.style.fontSize).toBe('1.4em')
  })

  test('Utility test - handle step "out of bounds" for relative units', () => {
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

describe('Utility test - handle step "out of bounds" for px defaulting to 2px', () => {
  let p

  beforeEach(() => {
    document.body.innerHTML = `<p id="test">Hello</p>`
    p = document.getElementById('test')
    p.style.fontSize = '12px'
  })

  test('Utility test - set default value for step to 2px if step < 1', () => {
    const resizer = createTextResizerController({
      selectors: ['#test'],
      step: 0.2,
      maxSize: 40
    })

    resizer.increase()

    const newSize = window.getComputedStyle(p).fontSize
    expect(newSize).toBe('14px')
  })

  test('Utility test - set default value for step to 2px if < 1, even if written as decimal', () => {
    const resizer = createTextResizerController({
      selectors: ['#test'],
      step: '0.2',
      maxSize: 40
    })

    resizer.increase()

    const newSize = window.getComputedStyle(p).fontSize
    expect(newSize).toBe('14px')
  })
})