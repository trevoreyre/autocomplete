import AutocompleteCore from '../autocomplete/AutocompleteCore.js'
import uniqueId from '../autocomplete/util/uniqueId.js'
import getRelativePosition from '../autocomplete/util/getRelativePosition.js'

class Autocomplete {
  expanded = false
  loading = false
  position = {}
  resetPosition = true

  constructor(
    root,
    {
      search,
      onSubmit = () => {},
      baseClass = 'autocomplete',
      autoSelect,
      getResultValue = result => result,
      renderResults,
    } = {}
  ) {
    if (typeof root === 'string') {
      this.root = document.querySelector(root)
    } else {
      this.root = root
    }
    this.input = this.root.querySelector('input')
    this.resultList = this.root.querySelector('ul')
    this.baseClass = baseClass
    this.getResultValue = getResultValue
    this.renderResults = renderResults
    this.core = new AutocompleteCore({
      search,
      autoSelect,
      setValue: this.setValue,
      setAttribute: this.setAttribute,
      onUpdate: this.handleUpdate,
      onSubmit,
      onShow: this.handleShow,
      onHide: this.handleHide,
      onLoading: this.handleLoading,
      onLoaded: this.handleLoaded,
    })

    this.initialize()
  }

  // Set up aria attributes and events
  initialize = () => {
    this.root.style.position = 'relative'

    this.input.setAttribute('role', 'combobox')
    this.input.setAttribute('autocomplete', 'off')
    this.input.setAttribute('autocapitalize', 'off')
    this.input.setAttribute('autocorrect', 'off')
    this.input.setAttribute('spellcheck', 'false')
    this.input.setAttribute('aria-autocomplete', 'list')
    this.input.setAttribute('aria-haspopup', 'listbox')
    this.input.setAttribute('aria-expanded', 'false')

    this.resultList.setAttribute('role', 'listbox')
    this.resultList.style.position = 'absolute'
    this.resultList.style.zIndex = '1'
    this.resultList.style.width = '100%'
    this.resultList.style.boxSizing = 'border-box'

    // Generate ID for results list if it doesn't have one
    if (!this.resultList.id) {
      this.resultList.id = uniqueId(`${this.baseClass}-result-list-`)
    }
    this.input.setAttribute('aria-owns', this.resultList.id)

    document.body.addEventListener('click', this.handleDocumentClick)
    this.input.addEventListener('input', this.core.handleInput)
    this.input.addEventListener('keydown', this.core.handleKeyDown)
    this.input.addEventListener('focus', this.core.handleFocus)
    this.input.addEventListener('blur', this.core.handleBlur)
    this.resultList.addEventListener(
      'mousedown',
      this.core.handleResultMouseDown
    )
    this.resultList.addEventListener('click', this.core.handleResultClick)
    this.updateStyle()
  }

  setAttribute = (attribute, value) => {
    this.input.setAttribute(attribute, value)
  }

  setValue = result => {
    this.input.value = result ? this.getResultValue(result) : ''
  }

  handleUpdate = (results, selectedIndex) => {
    const resultProps = results.map((result, index) => {
      const isSelected = selectedIndex === index
      return `
        id='${this.baseClass}-result-${index}'
        class='${this.baseClass}-result'
        data-result-index='${index}'
        role='option'
        ${isSelected ? "aria-selected='true'" : ''}
      `
    })

    this.resultList.innerHTML =
      typeof this.renderResults === 'function'
        ? this.renderResults(results, resultProps)
        : results
            .map(
              (result, index) => `
                <li ${resultProps[index]}>
                  ${this.getResultValue(result)}
                </li>
              `
            )
            .join('')

    this.input.setAttribute(
      'aria-activedescendant',
      selectedIndex > -1 ? `${this.baseClass}-result-${selectedIndex}` : ''
    )

    if (this.resetPosition) {
      this.resetPosition = false
      this.position = getRelativePosition(this.input, this.resultList)
      this.updateStyle()
    }
    this.core.checkSelectedResultVisible(this.resultList)
  }

  handleShow = () => {
    this.expanded = true
    this.updateStyle()
  }

  handleHide = () => {
    this.expanded = false
    this.resetPosition = true
    this.updateStyle()
  }

  handleLoading = () => {
    this.loading = true
    this.updateStyle()
  }

  handleLoaded = () => {
    this.loading = false
    this.updateStyle()
  }

  handleDocumentClick = event => {
    if (this.root.contains(event.target)) {
      return
    }
    this.core.hideResults()
  }

  updateStyle = () => {
    this.root.dataset.expanded = this.expanded
    this.root.dataset.loading = this.loading
    this.root.dataset.position = this.position

    this.resultList.style.visibility = this.expanded ? 'visible' : 'hidden'
    this.resultList.style.pointerEvents = this.expanded ? 'auto' : 'none'
    if (this.position === 'below') {
      this.resultList.style.bottom = null
      this.resultList.style.top = '100%'
    } else {
      this.resultList.style.top = null
      this.resultList.style.bottom = '100%'
    }
  }
}

export default Autocomplete
