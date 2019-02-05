import closest from './util/closest.js'
import isPromise from './util/isPromise.js'

class AutocompleteCore {
  value = ''
  searchCounter = 0
  results = []
  selectedIndex = -1
  scrollBarWidth = window.innerWidth - document.documentElement.clientWidth

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
    this.search = isPromise(search)
      ? search
      : value => Promise.resolve(search(value))
    this.autoSelect = autoSelect
    this.setValue = setValue
    this.setAttribute = setAttribute
    this.onUpdate = onUpdate
    this.onSubmit = onSubmit
    this.onShow = onShow
    this.onHide = onHide
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
        this.handleArrows(selectedIndex)
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
    const result = closest(target, '[data-result-index]')
    if (result) {
      this.selectedIndex = Number.parseInt(result.dataset.resultIndex, 10)
      const selectedResult = this.results[this.selectedIndex]
      this.selectResult()
      this.onSubmit(selectedResult)
    }
  }

  handleArrows = selectedIndex => {
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
    const currentSearch = ++this.searchCounter
    this.search(value).then(results => {
      if (currentSearch !== this.searchCounter) {
        return
      }
      this.results = results

      if (this.results.length === 0) {
        this.hideResults()
        return
      }

      this.selectedIndex = this.autoSelect ? 0 : -1
      this.onUpdate(this.results, this.selectedIndex)
      this.showResults()
    })
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
