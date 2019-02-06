// Polyfill for element.closest, to support Internet Explorer. It's a relatively
// simple polyfill, so we'll just include it rather than require the user to
// include the polyfill themselves. Adapted from
// https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
import matches from './matches.js'

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
  return element.closest
    ? element.closest(selector)
    : closestPolyfill(element, selector)
}

export default closest
