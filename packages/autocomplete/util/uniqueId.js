// Generates a unique ID, with optional prefix. Adapted from
// https://github.com/lodash/lodash/blob/61acdd0c295e4447c9c10da04e287b1ebffe452c/uniqueId.js
let idCounter = 0
const uniqueId = (prefix = '') => `${prefix}${++idCounter}`

export default uniqueId
