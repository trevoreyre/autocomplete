import Autocomplete from '../autocomplete'

class JsAutocomplete {
  constructor({
    root,
    input,
    results,
    searchFn,
    shouldAutoSelect = false,
    onShow = () => { },
    onHide = () => { }
  } = {}) {
    this.root = root
    this.input = input
    this.results = results

    this.autocomplete = new Autocomplete({
      setAttribute: this.setAttribute(this.root),
      getValue: this.getValue,
      setValue: this.setValue,
      setInputAttribute: this.setAttribute(this.input),
      setSelectionRange: this.setSelectionRange,
      showResults: this.showResults,
      hideResults: this.hideResults,
      resultsNode: results,
      searchFn,
      shouldAutoSelect,
      onShow,
      onHide,
      onUpdateResults: this.handleUpdateResults,
      onHideResults: this.handleHideResults,
      shouldAutocomplete: this.input.getAttribute('aria-autocomplete') === 'both'
    })
    console.log('this.autocomplete', this.autocomplete)

    // Setup events
    document.body.addEventListener('click', this.handleDocumentClick)
    this.input.addEventListener('keyup', this.autocomplete.handleKeyup)
    this.input.addEventListener('keydown', this.autocomplete.handleKeydown)
    this.input.addEventListener('focus', this.autocomplete.handleFocus)
    this.results.addEventListener('click', this.autocomplete.handleResultClick)
  }

  setAttribute = element => (attribute, value) => {
    element.setAttribute(attribute, value)
  }

  getValue = () => this.input.value

  setValue = value => {
    this.input.value = value
  }

  setSelectionRange = (start, end) => {
    this.input.setSelectionRange(start, end)
  }

  showResults = () => {
    this.results.classList.remove('hidden')
  }

  hideResults = () => {
    this.results.classList.add('hidden')
  }

  handleDocumentClick = event => {
    console.log('handleDocumentClick', event.target);
    if (this.root.contains(event.target)) {
      return
    }
    this.autocomplete.hideResults()
  }

  handleUpdateResults = (results, activeIndex) => {
    console.log('handleUpdateResults', results);
    if (results.length === 0) {
      this.resultsNode.innerHtml
    }
  }

  handleHideResults = () => {

  }
}

export default JsAutocomplete
