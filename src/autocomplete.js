class Autocomplete {
  constructor({
    searchFn,
    shouldAutoSelect = false,
    shouldAutocomplete = false,
    onShow = () => { },
    onHide = () => { },
    setAttribute = () => { },
    getValue = () => { },
    setValue = () => { },
    setInputAttribute = () => { },
    setSelectionRange = () => { },
    renderResults = () => { },
  } = {}) {
    this.setAttribute = setAttribute
    this.getValue = getValue
    this.setValue = setValue
    this.setInputAttribute = setInputAttribute
    this.setSelectionRange = setSelectionRange
    this.renderResults = renderResults
    this.searchFn = searchFn
    this.shouldAutoSelect = shouldAutoSelect
    this.onShow = onShow
    this.onHide = onHide
    this.activeIndex = -1
    this.results = []
    this.resultsCount = 0
    this.shouldAutocomplete = shouldAutocomplete
  }

  handleKeyup = event => {
    const { key } = event
    console.log('handleKeyup', key);

    switch (key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'Escape':
      case 'Enter':

        event.preventDefault()
        return
      default:
        this.updateResults()
    }

    if (this.shouldAutocomplete) {
      switch (key) {
        case 'Backspace':
          return
        default:
          this.autocompleteItem()
      }
    }
  }

  handleKeydown = event => {
    const { key } = event
    console.log('handleKeydown', key);
    this.activeIndex

    if (key === 'Escape') {
      this.hideResults()
      this.setValue('')
      return
    }

    if (this.resultsCount < 1) {
      if (this.shouldAutocomplete && (key === 'ArrowDown' || key === 'ArrowUp')) {
        this.updateResults()
      } else {
        return
      }
    }

    switch (key) {
      case 'ArrowUp':
        if (this.activeIndex <= 0) {
          this.activeIndex = this.resultsCount - 1
        } else {
          this.activeIndex -= 1
        }
        break
      case 'ArrowDown':
        if (this.activeIndex === -1 || this.activeIndex >= this.resultsCount - 1) {
          this.activeIndex = 0
        } else {
          this.activeIndex += 1
        }
        break
      case 'Enter':
        this.selectActiveResult()
        return
      case 'Tab':
        this.checkSelection()
        this.hideResults()
        return
      default:
        return
    }

    const activeResult = this.results[this.activeIndex]
    this.renderResults(this.results, this.activeIndex)

    if (activeResult) {
      this.setInputAttribute(
        'aria-activedescendant',
        `autocomplete-result-${this.activeIndex}`
      )
      if (this.shouldAutocomplete) {
        this.setValue(activeResult)
      }
    } else {
      this.setInputAttribute('aria-activedescendant', '')
    }
  }

  handleFocus = () => {
    this.updateResults()
  }

  handleResultClick = event => {
    if (event.target && event.target.nodeName === 'LI') {
      const { target } = event
      this.activeIndex = [...target.parentElement.children].indexOf(target)
      this.selectActiveResult()
    }
  }

  selectActiveResult = () => {
    const activeResult = this.results[this.activeIndex]
    if (activeResult) {
      this.setValue(activeResult)
      this.hideResults()
    }
  }

  checkSelection = () => {
    if (this.activeIndex < 0) {
      return
    }
    this.selectActiveResult()
  }

  autocompleteItem = () => {
    const activeResult = this.results[this.activeIndex]
    const input = this.getValue()
    if (!activeResult || !input) {
      return
    }

    if (input !== activeResult) {
      this.setValue(activeResult)
      this.setSelectionRange(input.length, activeResult.length)
    }
  }

  updateResults = () => {
    this.hideResults()
    const input = this.getValue()

    console.log('updateResults', input);
    this.results = this.searchFn(input)
    if (this.results.length === 0) {
      return
    }

    if (this.shouldAutoSelect) {
      this.activeIndex = 0
      this.setInputAttribute(
        'aria-activedescendant',
        `autocomplete-result-${this.activeIndex}`
      )
    }

    this.renderResults(this.results, this.activeIndex)
    this.showResults()
    this.setAttribute('aria-expanded', true)
    this.resultsCount = this.results.length
    this.shown = true
    this.onShow()
  }

  hideResults = () => {
    this.shown = false
    this.activeIndex = -1
    this.setAttribute('aria-expanded', false)
    this.results = []
    this.resultsCount = 0
    this.setInputAttribute('aria-activedescendant', '')
    this.onHide()
  }

  showResults = () => {
    this.shown = true
    this.setAttribute('aria-expanded', true)
    this.onShow()
  }
}

export default Autocomplete
