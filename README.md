# text-resizer

## General information
This is a student project and future improvements can't be expected. Feel free to contribute or copy for other projects. 
MIT license applies.

## Purpose
A JavaScript module designed to make text more accessible across different web interfaces.
This module allows developers to target different text elements and provide end users with options such as:

- Changing the text size
- Switching to a more readable font
- (pending) Increasing contrast between text and background

It is aimed to be especially useful for users with dyslexia (change of fonts), or other visual impairments that is helped by manipulating text size and other factors that affect the readability.

## Features

Resize text with some unit aware logic.
Switch fonts between serif and sans-serif depending on preferens.
Fallback for inconclusive inputs
Tested with jest and documented in `testrapport.md`

## Installation

```bash
npm install text-resizer
```
## Usage
```JavaScript
import { createTextResizerController } from 'text-resizer'

const resizer = createTextResizerController({
  selectors: ['element', '.class', '#id'],
    step: '2px',
    minSize: 6,
    maxSize: 40,
    root: document
})

// Example usage
resizer.increase() // Increases one step at a time
resizer.decrease()
resizer.restore() // Restores original value
resizer.changeFont()
```
My vision is to add a rightclick overwrite that allows end user to get a dropdown menu of how to manipulate the clicked text/element.

## API
| Method | Description |
|----|----|
| increase() | Increase text size one increment |
| decrease() | Decrease text size one increment |
| restore() | Restore to original size |
| setTextToMax() | Instantly set size to max value |
| setTextToMin() | Instantly set size to min value |
| changeFont() | Toggles between serif and sans-serif - dyslexia font might be imported in future |
| restoreFont() | Removes font override |

## Testing

This module is tested with Jest for automated unit testing. All major logic is covered and all edgecases I could think of as well, such as fallback and conversions.

```bash
npm test
```
See testrapport.md (swedish) for more details

## License 

MIT

