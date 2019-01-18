class AutocompleteCore {
  constructor({
    search,
    autoSelect = false,
    setValue = () => {},
    setAttribute = () => {},
    setInputAttribute = () => {},
    onUpdateResults = () => {},
    onSubmit = () => {},
  } = {}) {
    this.search = search
    this.autoSelect = autoSelect
    this.setValue = setValue
    this.setAttribute = setAttribute
    this.setInputAttribute = setInputAttribute
    this.onUpdateResults = onUpdateResults
    this.onSubmit = onSubmit

    this.value = ''
    this.results = []
    this.selectedIndex = -1
  }

  handleInput = event => {
    const { value } = event.target
    this.updateResults(value)
    this.value = value
  }

  handleKeydown = event => {
    const { key } = event

    switch (key) {
      case 'ArrowUp':
      case 'ArrowDown': {
        const selectedIndex =
          key === 'ArrowUp' ? this.selectedIndex - 1 : this.selectedIndex + 1
        this.handleArrowUpDown(selectedIndex)
        break
      }
      case 'Tab': {
        this.selectResult()
        break
      }
      case 'Enter': {
        const selectedResult = this.results[this.selectedIndex]
        this.selectResult()
        this.onSubmit(selectedResult)
        break
      }
      case 'Escape': {
        this.hideResults()
        this.setValue('')
        break
      }
      default:
        return
    }
  }

  handleResultClick = event => {
    const { target } = event
    if (target && target.nodeName === 'LI') {
      this.selectedIndex = [...target.parentElement.children].indexOf(target)
      const selectedResult = this.results[this.selectedIndex]
      this.selectResult()
      this.onSubmit(selectedResult)
    }
  }

  handleArrowUpDown = selectedIndex => {
    // Loop selectedIndex back to first or last result if out of bounds
    const resultsCount = this.results.length
    this.selectedIndex =
      ((selectedIndex % resultsCount) + resultsCount) % resultsCount

    // Update results and aria attributes
    this.onUpdateResults(this.results, this.selectedIndex)
    if (this.results[this.selectedIndex]) {
      this.setInputAttribute(
        'aria-activedescendant',
        `autocomplete-result-${this.selectedIndex}`
      )
    } else {
      this.setInputAttribute('aria-activedescendant', '')
    }
  }

  selectResult = () => {
    const selectedResult = this.results[this.selectedIndex]
    if (selectedResult) {
      this.setValue(selectedResult)
      this.hideResults()
    }
  }

  updateResults = value => {
    this.results = this.search(value)

    if (this.results.length === 0) {
      this.hideResults()
      return
    }

    if (this.autoSelect) {
      this.selectedIndex = 0
      this.setInputAttribute(
        'aria-activedescendant',
        `autocomplete-result-${this.selectedIndex}`
      )
    }

    this.onUpdateResults(this.results, this.selectedIndex)
    this.setAttribute('aria-expanded', true)
  }

  hideResults = () => {
    this.selectedIndex = -1
    this.results = []
    this.setAttribute('aria-expanded', false)
    this.setInputAttribute('aria-activedescendant', '')
    this.onUpdateResults(this.results, this.selectedIndex)
  }
}

export default AutocompleteCore
