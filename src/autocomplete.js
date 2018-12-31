class Autocomplete {
  constructor({
    resultsNode,
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
    showResults = () => { },
    hideResults = () => { },
  } = {}) {
    this.setAttribute = setAttribute
    this.getValue = getValue
    this.setValue = setValue
    this.setInputAttribute = setInputAttribute
    this.setSelectionRange = setSelectionRange
    this.showResults = showResults
    this.hideResults = hideResults
    this.resultsNode = resultsNode
    this.searchFn = searchFn
    this.shouldAutoSelect = shouldAutoSelect
    this.onShow = onShow
    this.onHide = onHide
    this.activeIndex = -1
    this.resultsCount = 0
    this.shouldAutocomplete = shouldAutocomplete
  }

  handleKeyup = event => {
    const { key } = event

    switch (key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'Escape':
      case 'Enter':

        event.preventDefault()
        return
      default:
        this._updateResults()
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
    let activeIndex = this.activeIndex

    if (key === 'Escape') {
      this._hideResults()
      this.setValue('')
      return
    }

    if (this.resultsCount < 1) {
      if (this.shouldAutocomplete && (key === 'ArrowDown' || key === 'ArrowUp')) {
        this._updateResults()
      } else {
        return
      }
    }

    const prevActive = this.getItemAt(activeIndex)
    let activeItem

    switch (key) {
      case 'ArrowUp':
        if (activeIndex <= 0) {
          activeIndex = this.resultsCount - 1
        } else {
          activeIndex -= 1
        }
        break
      case 'ArrowDown':
        if (activeIndex === -1 || activeIndex >= this.resultsCount - 1) {
          activeIndex = 0
        } else {
          activeIndex += 1
        }
        break
      case 'Enter':
        activeItem = this.getItemAt(activeIndex)
        this.selectItem(activeItem)
        return
      case 'Tab':
        this.checkSelection()
        this._hideResults()
        return
      default:
        return
    }

    event.preventDefault()
    activeItem = this.getItemAt(activeIndex)
    this.activeIndex = activeIndex

    if (prevActive) {
      prevActive.classList.remove('selected')
      prevActive.setAttribute('aria-selected', 'false')
    }

    if (activeItem) {
      this.setInputAttribute('aria-activedescendant', `autocomplete-result-${activeIndex}`)
      activeItem.classList.add('selected')
      activeItem.setAttribute('aria-selected', 'true')
      if (this.shouldAutocomplete) {
        this.setValue(activeItem.innerText)
      }
    } else {
      this.setInputAttribute('aria-activedescendant', '')
    }
  }

  handleFocus = event => {
    this._updateResults()
  }

  handleResultClick = event => {
    if (event.target && event.target.nodeName === 'LI') {
      this.selectItem(event.target)
    }
  }

  getItemAt = index => {
    return this.resultsNode.querySelector(`#autocomplete-result-${index}`)
  }

  selectItem = node => {
    if (node) {
      this.setValue(node.innerText)
      this._hideResults()
    }
  }

  checkSelection = () => {
    if (this.activeIndex < 0) {
      return
    }
    const activeItem = this.getItemAt(this.activeIndex)
    this.selectItem(activeItem)
  }

  autocompleteItem = event => {
    const autocompletedItem = this.resultsNode.querySelector('.selected')
    const input = this.getValue()
    if (!autocompletedItem || !input) {
      return
    }

    const autocomplete = autocompletedItem.innerText
    if (input !== autocomplete) {
      this.setValue(autocomplete)
      this.setSelectionRange(input.length, autocomplete.length)
    }
  }

  _updateResults = () => {
    const input = this.getValue()
    const results = this.searchFn(input)

    this._hideResults()
    if (results.length === 0) {
      return
    }

    if (this.shouldAutoSelect) {
      this.activeIndex = 0
    }

    this.resultsNode.innerHTML = results.map((result, index) => {
      const isSelected = this.shouldAutoSelect && index === 0
      if (isSelected) {
        this.activeIndex = 0
      }
      return `
        <li
          id='autocomplete-result-${index}'
          class='autocomplete-result${isSelected ? ' selected' : ''}'
          role='option'
          ${isSelected ? "aria-selected='true'" : ''}
        >
          ${result}
        </li>
      `
    }).join('')

    this.showResults()
    this.setAttribute('aria-expanded', true)
    this.resultsCount = results.length
    this.shown = true
    this.onShow()
  }

  _hideResults = () => {
    this.shown = false
    this.activeIndex = -1
    this.hideResults()
    this.setAttribute('aria-expanded', false)
    this.resultsCount = 0
    this.setInputAttribute('aria-activedescendant', '')
    this.onHide()
  }
}

export default Autocomplete
