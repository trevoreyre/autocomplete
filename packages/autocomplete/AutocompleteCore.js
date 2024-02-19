import closest from './util/closest.js'
import isPromise from './util/isPromise.js'

class AutocompleteCore {
  value = ''
  searchCounter = 0
  results = []
  selectedIndex = -1
  selectedResult = null

  constructor({
    search,
    autoSelect = false,
    setValue = () => {},
    setAttribute = () => {},
    onUpdate = () => {},
    onSubmit = () => {},
    onShow = () => {},
    autocorrect = false,
    onHide = () => {},
    onLoading = () => {},
    onLoaded = () => {},
    submitOnEnter = false,
  } = {}) {
    this.search = isPromise(search)
      ? search
      : value => Promise.resolve(search(value))
    this.autoSelect = autoSelect
    this.setValue = setValue
    this.setAttribute = setAttribute
    this.onUpdate = onUpdate
    this.onSubmit = onSubmit
    this.autocorrect = autocorrect
    this.onShow = onShow
    this.onHide = onHide
    this.onLoading = onLoading
    this.onLoaded = onLoaded
    this.submitOnEnter = submitOnEnter
  }

  destroy = () => {
    this.search = null
    this.setValue = null
    this.setAttribute = null
    this.onUpdate = null
    this.onSubmit = null
    this.autocorrect = null
    this.onShow = null
    this.onHide = null
    this.onLoading = null
    this.onLoaded = null
  }

  handleInput = event => {
    const { value } = event.target
    this.updateResults(value)
    this.value = value
  }

  handleKeyDown = event => {
    const { key, ctrlKey, altKey } = event

    switch (key) {
      case 'Up': // IE/Edge
      case 'Down': // IE/Edge
      case 'ArrowUp':
      case 'ArrowDown': {
        const isUp = (key === 'ArrowUp' || key === 'Up');
        if (altKey === false) {
          const selectedIndex = (isUp === true)
              ? this.selectedIndex - 1
              : this.selectedIndex + 1
          event.preventDefault()
          this.handleArrows(selectedIndex)
        } else {
          // Based on recomendations from
          // https://www.w3.org/WAI/ARIA/apg/patterns/combobox/#keyboardinteraction
          if (isUp === true) {
            // "Alt + Up Arrow (Optional): If the popup is displayed:
            //     If the popup contains focus, returns focus to the combobox.
            //     Closes the popup."
            this.hideResults();
          } else {
            // "Alt + Down Arrow (Optional): If the popup is available but not displayed,
            //     displays the popup without moving focus."
            this.showResults();
          }
        }
        break
      }
      case 'Tab': {
        this.selectResult()
        break
      }
      case 'Home': {
        // Based on recomendations from
        // https://www.w3.org/WAI/ARIA/apg/patterns/combobox/#keyboardinteraction
        // "Control + Home (optional): moves focus to the first row."
        if (ctrlKey === true) {
          this.handleArrows(0);
        }
        break;
      }
      case 'End':{
        // Based on recomendations from
        // https://www.w3.org/WAI/ARIA/apg/patterns/combobox/#keyboardinteraction
        // "Control + End (Optional): moves focus to the last row."
        if (ctrlKey === true) {
          this.handleArrows(this.results.length - 1);
        }
        break;
      }
      case 'Enter': {
        const isListItemSelected =
          event.target.getAttribute('aria-activedescendant').length > 0

        this.selectedResult =
          this.results[this.selectedIndex] || this.selectedResult
        this.selectResult()

        if (this.submitOnEnter) {
          this.selectedResult && this.onSubmit(this.selectedResult)
        } else {
          if (isListItemSelected) {
            event.preventDefault()
          } else {
            this.selectedResult && this.onSubmit(this.selectedResult)
            this.selectedResult = null
          }
        }
        break
      }
      case 'Esc': // IE/Edge
      case 'Escape': {
        this.hideResults()
        this.setValue()
        break
      }
      default:
        return
    }
  }

  handleFocus = event => {
    const { value } = event.target
    this.updateResults(value)
    this.value = value
  }

  handleBlur = () => {
    this.hideResults()
  }

  // The mousedown event fires before the blur event. Calling preventDefault() when
  // the results list is clicked will prevent it from taking focus, firing the
  // blur event on the input element, and closing the results list before click fires.
  handleResultMouseDown = event => {
    event.preventDefault()
  }

  handleResultClick = event => {
    const { target } = event
    const result = closest(target, '[data-result-index]')
    if (result) {
      this.selectedIndex = parseInt(result.dataset.resultIndex, 10)
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
    this.onLoading()
    this.search(value).then(results => {
      if (currentSearch !== this.searchCounter) {
        return
      }
      this.results = results
      this.onLoaded()

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
    this.onShow()
  }

  hideResults = () => {
    this.selectedIndex = -1
    this.results = []
    this.setAttribute('aria-expanded', false)
    this.setAttribute('aria-activedescendant', '')
    this.onUpdate(this.results, this.selectedIndex)
    this.onHide()
  }

  // Make sure selected result isn't scrolled out of view
  checkSelectedResultVisible = resultsElement => {
    const selectedResultElement = resultsElement.querySelector(
      `[data-result-index="${this.selectedIndex}"]`
    )
    if (!selectedResultElement) {
      return
    }

    const resultsPosition = resultsElement.getBoundingClientRect()
    const selectedPosition = selectedResultElement.getBoundingClientRect()

    if (selectedPosition.top < resultsPosition.top) {
      // Element is above viewable area
      resultsElement.scrollTop -= resultsPosition.top - selectedPosition.top
    } else if (selectedPosition.bottom > resultsPosition.bottom) {
      // Element is below viewable area
      resultsElement.scrollTop +=
        selectedPosition.bottom - resultsPosition.bottom
    }
  }
}

export default AutocompleteCore
