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
      onUpdateResults: this.handleUpdateResults,
      onSubmit,
    })

    // Setup events
    document.body.addEventListener('click', this.handleDocumentClick)
    this.input.addEventListener('input', this.autocomplete.handleInput)
    this.input.addEventListener('keydown', this.autocomplete.handleKeydown)
    this.results.addEventListener('click', this.autocomplete.handleResultClick)
  }

  updateResultsPosition = () => {
    const inputPosition = this.input.getBoundingClientRect()
    console.log('inputPosition:', inputPosition)
    this.results.style = {
      position: 'fixed',
      top: inputPosition.bottom + 'px',
      left: inputPosition.left + 'px',
      width: inputPosition.width + 'px',
    }
    const resultsPosition = this.results.getBoundingClientRect()
    console.log('resultsPosition:', resultsPosition)
    console.log('window.innerHeight:', window.innerHeight)
    if (resultsPosition.bottom > window.innerHeight) {
      console.log('update results position')
      this.results.style = {
        position: 'fixed',
        bottom: inputPosition.top + 'px',
        left: inputPosition.left + 'px',
        width: inputPosition.width + 'px',
      }
    }
  }

  setAttribute = (attribute, value) => {
    this.input.setAttribute(attribute, value)
  }

  setValue = result => {
    this.input.value = result ? this.getResultValue(result) : ''
  }

  handleUpdateResults = (results, selectedIndex) => {
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

  handleDocumentClick = event => {
    if (this.root.contains(event.target)) {
      return
    }
    this.autocomplete.hideResults()
  }
}

export default Autocomplete
