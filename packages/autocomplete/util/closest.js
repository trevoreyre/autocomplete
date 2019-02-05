// This is a simple polyfill for element.closest, to support IE. While we do require the
// user to polyfill Promises to support IE, element.closest is a slightly less
// common polyfill to require, and it's relatively little code, so we'll just include
// it here.
const matches = (element, selector) => {
  return (element.matches ||
    element.msMatchesSelector ||
    element.mozMatchesSelector ||
    element.webkitMatchesSelector)(selector)
}

const closestPolyfill = (el, selector) => {
  let element = el
  while (element && element.nodeType === 1) {
    if (matches(element, selector)) {
      return element
    }
    element = element.parentNode
  }
  return null
}

const closest = (element, selector) => {
  if (element.closest) {
    return element.closest(selector)
  } else {
    return closestPolyfill(element, selector)
  }
}

export default closest
