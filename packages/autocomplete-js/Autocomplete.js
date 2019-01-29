import AutocompleteCore from '../autocomplete/AutocompleteCore.js'

class Autocomplete {
  constructor(
    root,
    {
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

    this.results.style.position = 'fixed'
    this.results.style.zIndex = '1'

    // Setup events
    document.body.addEventListener('click', this.handleDocumentClick)
    this.input.addEventListener('input', this.autocomplete.handleInput)
    this.input.addEventListener('keydown', this.autocomplete.handleKeydown)
    this.results.addEventListener('click', this.autocomplete.handleResultClick)
  }

  updateResultsPosition = () => {
    const inputPosition = this.input.getBoundingClientRect()
    const resultsPosition = this.results.getBoundingClientRect()

    // Place results below input, unless there isn't enough room
    let yPosition = { key: 'top', value: inputPosition.bottom + 'px' }
    if (inputPosition.bottom + resultsPosition.height > window.innerHeight) {
      yPosition = {
        key: 'bottom',
        value: window.innerHeight - inputPosition.top + 'px',
      }
    }
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
      return `class='autocomplete-result' role='option' ${
        isSelected ? "aria-selected='true'" : ''
      }`
    })

    this.results.innerHTML =
      typeof this.renderResults === 'function'
        ? this.renderResults(results, resultProps)
        : results
            .map(
              (result, index) => `
              <li
                id='autocomplete-result-${index}'
                ${resultProps[index]}
              >
                ${this.getResultValue(result)}
              </li>
            `
            )
            .join('')
    this.updateResultsPosition()
  }

  handleShow = () => {
    this.results.style.visibility = 'visible'
    this.results.style.pointerEvents = 'auto'
  }

  handleHide = () => {
    this.results.style.visibility = 'hidden'
    this.results.style.pointerEvents = 'none'
  }

  handleDocumentClick = event => {
    if (this.root.contains(event.target)) {
      return
    }
    this.autocomplete.hideResults()
  }
}

export default Autocomplete
