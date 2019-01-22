import AutocompleteCore from '../autocomplete/AutocompleteCore.js'

class Autocomplete {
  constructor({
    root,
    input,
    results,
    search,
    autoSelect,
    renderResults,
    onSubmit = () => {},
  } = {}) {
    this.root = root
    this.input = input
    this.results = results
    this.renderResults = renderResults
    this.autocomplete = new AutocompleteCore({
      search,
      autoSelect,
      setValue: this.setValue,
      setAttribute: this.setAttribute(this.root),
      setInputAttribute: this.setAttribute(this.input),
      onUpdateResults: this.handleUpdateResults,
      onSubmit,
    })

    // Setup events
    document.body.addEventListener('click', this.handleDocumentClick)
    this.input.addEventListener('input', this.autocomplete.handleInput)
    this.input.addEventListener('keydown', this.autocomplete.handleKeydown)
    this.results.addEventListener('click', this.autocomplete.handleResultClick)
  }

  setAttribute = element => (attribute, value) => {
    element.setAttribute(attribute, value)
  }

  setValue = value => {
    this.input.value = value
  }

  handleUpdateResults = (results, selectedIndex) => {
    this.results.innerHTML = (typeof this.renderResults === 'function') ? (
      this.renderResults(results, selectedIndex)
    ) : (
      results.map((result, index) => {
        const isSelected = selectedIndex === index
        return `
          <li
            id='autocomplete-result-${index}'
            class='autocomplete-result'
            role='option'
            ${isSelected ? "aria-selected='true'" : ''}
          >
            ${result}
          </li>
        `
      })
      .join('')
    )
  }

  handleDocumentClick = event => {
    if (this.root.contains(event.target)) {
      return
    }
    this.autocomplete.hideResults()
  }
}

export default Autocomplete
