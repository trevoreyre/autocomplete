class Autocomplete {
  constructor({
    searchFn,
    shouldAutoSelect = false,
    shouldAutocomplete = false,
    setAttribute = () => { },
    getValue = () => { },
    setValue = () => { },
    setInputAttribute = () => { },
    setSelectionRange = () => { },
    onUpdateResults = () => { },
  } = {}) {
    this.setAttribute = setAttribute
    this.getValue = getValue
    this.setValue = setValue
    this.setInputAttribute = setInputAttribute
    this.setSelectionRange = setSelectionRange
    this.onUpdateResults = onUpdateResults
    this.searchFn = searchFn
    this.shouldAutoSelect = shouldAutoSelect
    this.shouldAutocomplete = shouldAutocomplete

    this.value = ''
    this.results = []
    this.selectedIndex = -1
  }

  handleInput = event => {
    const { value } = event.target
    console.log('handleInput', this.value, '->', value)
    this.updateResults(value)
    if (value.length > this.value.length && this.shouldAutocomplete) {
      this.autocompleteResult(value)
    }
    this.value = value
  }

  handleKeydown = event => {
    const { key } = event
    console.log('handleKeydown', key);
    const resultsCount = this.results.length

    switch (key) {
      case 'ArrowUp':
        console.log('case ArrowUp');
        this.selectedIndex = (this.selectedIndex + 1) % resultsCount
        console.log('this.selectedIndex', this.selectedIndex);
        break
      case 'ArrowDown':
        console.log('case ArrowDown');
        this.selectedIndex = ((((this.selectedIndex - 1) % resultsCount) + resultsCount) % resultsCount)
        console.log('this.selectedIndex', this.selectedIndex);
        break
      case 'Enter':
        console.log('case Enter');
        break
      case 'Tab':
        console.log('case Tab');
        break
      case 'Escape':
        console.log('case Escape');
        break
      default:
        console.log('case default')
        return
    }
  }

  handleKeydownOld = event => {
    const { key } = event
    console.log('handleKeydown', key);
    const resultsCount = this.results.length

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
        if (this.selectedIndex <= 0) {
          this.selectedIndex = this.resultsCount - 1
        } else {
          this.selectedIndex -= 1
        }
        break
      case 'ArrowDown':
        if (this.selectedIndex === -1 || this.selectedIndex >= this.resultsCount - 1) {
          this.selectedIndex = 0
        } else {
          this.selectedIndex += 1
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

    const activeResult = this.results[this.selectedIndex]
    this.handleUpdateResults(this.results, this.selectedIndex)

    if (activeResult) {
      this.setInputAttribute(
        'aria-activedescendant',
        `autocomplete-result-${this.selectedIndex}`
      )
      if (this.shouldAutocomplete) {
        this.setValue(activeResult)
      }
    } else {
      this.setInputAttribute('aria-activedescendant', '')
    }
  }

  // handleFocus = () => {
  //   this.updateResults()
  // }

  handleResultClick = event => {
    console.log('handleResultClick', event.target);
    if (event.target && event.target.nodeName === 'LI') {
      const { target } = event
      this.selectedIndex = [...target.parentElement.children].indexOf(target)
      this.selectActiveResult()
    }
  }

  selectActiveResult = () => {
    const activeResult = this.results[this.selectedIndex]
    console.log('selectActiveResult', activeResult);
    if (activeResult) {
      this.setValue(activeResult)
      this.hideResults()
    }
  }

  checkSelection = () => {
    if (this.selectedIndex < 0) {
      return
    }
    this.selectActiveResult()
  }

  autocompleteResult = value => {
    console.log('autocompleteResult', value);
    const selectedResult = this.results[this.selectedIndex]
    if (!selectedResult || !value) {
      return
    }

    if (value !== selectedResult) {
      this.setValue(selectedResult)
      this.setSelectionRange(value.length, selectedResult.length)
    }
  }

  updateResults = value => {
    console.log('updateResults', value);
    this.results = this.searchFn(value)

    if (this.results.length === 0) {
      this.hideResults()
      return
    }

    if (this.shouldAutoSelect) {
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
    console.log('hideResults');
    this.selectedIndex = -1
    this.results = []
    this.setAttribute('aria-expanded', false)
    this.setInputAttribute('aria-activedescendant', '')
  }
}

export default Autocomplete
