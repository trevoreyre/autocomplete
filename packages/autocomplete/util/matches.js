// Polyfill for element.matches, to support Internet Explorer. It's a relatively
// simple polyfill, so we'll just include it rather than require the user to
// include the polyfill themselves. Adapted from
// https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
const matches = (element, selector) => {
  return element.matches
    ? element.matches(selector)
    : element.msMatchesSelector
    ? element.msMatchesSelector(selector)
    : element.webkitMatchesSelector
    ? element.webkitMatchesSelector(selector)
    : null
}

export default matches
