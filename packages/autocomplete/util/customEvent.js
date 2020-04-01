const defaultOptions = {
  bubbles: true,
  composed: true,
}

const customEvent = (event, detail = {}, options = {}) => {
  return new CustomEvent(event, { ...defaultOptions, detail, ...options })
}

export default customEvent
