/**
 * @typedef {Object} LabelObj
 * @property {string} attribute - `aria-label` | `aria-labelledby`
 * @property {string} content - content of attribute
 */

/**
 * @param {string} labelStr - content for `aria-label` or – if it starts with `#` – ID for `aria-labelledby`
 * @returns {LabelObj} Object with label attribute and its content
 */
const getAriaLabel = labelStr => {
  if (labelStr?.length) {
    const isLabelId = labelStr.startsWith('#')

    return {
      attribute: isLabelId ? 'aria-labelledby' : 'aria-label',
      content: isLabelId ? labelStr.substring(1) : labelStr,
    }
  }
}

export default getAriaLabel
