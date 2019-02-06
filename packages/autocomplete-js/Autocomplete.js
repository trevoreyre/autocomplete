import AutocompleteCore from '../autocomplete/AutocompleteCore.js'
import uniqueId from '../autocomplete/util/uniqueId.js'

class Autocomplete {
  constructor(
    root,
    {
      baseClass = 'autocomplete',
      search,
      autoSelect,
      getResultValue = result => result,
      renderResults,
      onSubmit = () => {},
    } = {}
  ) {
    if (typeof root === 'string') {
      this.root = document.querySelector(root)
    } else {
      this.root = root
    }
    this.input = this.root.querySelector('input')
    this.results = this.root.querySelector('ul')
    this.baseClass = baseClass
    this.getResultValue = getResultValue
    this.renderResults = renderResults
    this.autocomplete = new AutocompleteCore({
      search,
      autoSelect,
      setValue: this.setValue,
      setAttribute: this.setAttribute,
      onUpdate: this.handleUpdate,
      onSubmit,
      onShow: this.handleShow,
      onHide: this.handleHide,
    })

    this.resetResultsPosition = true
    this.initialize()
  }

  // Set up aria attributes and events
  initialize = () => {
    this.input.setAttribute('role', 'combobox')
    this.input.setAttribute('autocomplete', 'off')
    this.input.setAttribute('autocapitalize', 'off')
    this.input.setAttribute('autocorrect', 'off')
    this.input.setAttribute('spellcheck', 'false')
    this.input.setAttribute('aria-autocomplete', 'list')
    this.input.setAttribute('aria-haspopup', 'listbox')
    this.input.setAttribute('aria-expanded', 'false')

    // Generate ID for results list if it doesn't have one
    if (!this.results.id) {
      this.results.id = uniqueId(`${this.baseClass}-results-`)
    }
    this.input.setAttribute('aria-owns', this.results.id)

    this.results.setAttribute('role', 'listbox')
    this.results.style.position = 'fixed'
    this.results.style.zIndex = '1'
    this.handleHide()

    document.body.addEventListener('click', this.handleDocumentClick)
    this.input.addEventListener('input', this.autocomplete.handleInput)
    this.input.addEventListener('keydown', this.autocomplete.handleKeydown)
    this.results.addEventListener('click', this.autocomplete.handleResultClick)
  }

  updateResultsPosition = () => {
    // Prevent results from flipping from above input to below while open
    if (!this.resetResultsPosition) {
      return
    }
    this.resetResultsPosition = false

    const inputPosition = this.input.getBoundingClientRect()
    const resultsPosition = this.results.getBoundingClientRect()

    // Place results below input, unless there isn't enough room
    let yPosition = { key: 'top', value: inputPosition.bottom + 'px' }
    let resetYPosition = 'bottom'
    if (inputPosition.bottom + resultsPosition.height > window.innerHeight) {
      yPosition = {
        key: 'bottom',
        value: window.innerHeight - inputPosition.top + 'px',
      }
      resetYPosition = 'top'
    }
    this.results.style[resetYPosition] = null
    this.results.style[yPosition.key] = yPosition.value
    this.results.style.left = inputPosition.left + 'px'
    this.results.style.width = inputPosition.width + 'px'
  }

  setAttribute = (attribute, value) => {
    this.input.setAttribute(attribute, value)
  }

  setValue = result => {
    this.input.value = result ? this.getResultValue(result) : ''
  }

  handleUpdate = (results, selectedIndex) => {
    const resultProps = results.map((result, index) => {
      const isSelected = selectedIndex === index
      return `id='${this.baseClass}-result-${index}' class='${
        this.baseClass
      }-result' data-result-index='${index}' role='option' ${
        isSelected ? "aria-selected='true'" : ''
      }`
    })

    this.results.innerHTML =
      typeof this.renderResults === 'function'
        ? this.renderResults(results, resultProps)
        : results
            .map(
              (result, index) => `
              <li ${resultProps[index]}>
                ${this.getResultValue(result)}
              </li>
            `
            )
            .join('')

    this.input.setAttribute(
      'aria-activedescendant',
      selectedIndex > -1 ? `${this.baseClass}-result-${selectedIndex}` : ''
    )
    this.updateResultsPosition()
  }

  handleShow = () => {
    this.results.style.visibility = 'visible'
    this.results.style.pointerEvents = 'auto'
  }

  handleHide = () => {
    this.results.style.visibility = 'hidden'
    this.results.style.pointerEvents = 'none'
    this.resetResultsPosition = true
  }

  handleDocumentClick = event => {
    if (this.root.contains(event.target)) {
      return
    }
    this.autocomplete.hideResults()
  }
}

export default Autocomplete
