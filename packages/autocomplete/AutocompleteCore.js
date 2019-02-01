class AutocompleteCore {
  constructor({
    search,
    autoSelect = false,
    setValue = () => {},
    setAttribute = () => {},
    onUpdate = () => {},
    onSubmit = () => {},
    onShow = () => {},
    onHide = () => {},
  } = {}) {
    this.search = search
    this.autoSelect = autoSelect
    this.setValue = setValue
    this.setAttribute = setAttribute
    this.onUpdate = onUpdate
    this.onSubmit = onSubmit
    this.onShow = onShow
    this.onHide = onHide

    this.value = ''
    this.results = []
    this.selectedIndex = -1
    this.scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth
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
        event.preventDefault()
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
        this.setValue()
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
    this.onUpdate(this.results, this.selectedIndex)
  }

  selectResult = () => {
    const selectedResult = this.results[this.selectedIndex]
    if (selectedResult) {
      this.setValue(selectedResult)
    }
    this.hideResults()
  }

  updateResults = value => {
    this.results = this.search(value)

    if (this.results.length === 0) {
      this.hideResults()
      return
    }

    if (this.autoSelect) {
      this.selectedIndex = 0
    }

    this.onUpdate(this.results, this.selectedIndex)
    this.showResults()
  }

  showResults = () => {
    this.setAttribute('aria-expanded', true)
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = this.scrollBarWidth + 'px'
    this.onShow()
  }

  hideResults = () => {
    this.selectedIndex = -1
    this.results = []
    this.setAttribute('aria-expanded', false)
    document.body.style.overflow = null
    document.body.style.paddingRight = null
    this.setAttribute('aria-activedescendant', '')
    this.onUpdate(this.results, this.selectedIndex)
    this.onHide()
  }
}

export default AutocompleteCore
