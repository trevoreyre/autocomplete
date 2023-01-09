import AutocompleteCore from '../autocomplete/AutocompleteCore.js'
import uniqueId from '../autocomplete/util/uniqueId.js'
import getRelativePosition from '../autocomplete/util/getRelativePosition.js'
import debounce from '../autocomplete/util/debounce.js'
import getAriaLabel from '../autocomplete/util/getAriaLabel.js'

// Creates a props object with overridden toString function. toString returns an attributes
// string in the format: `key1="value1" key2="value2"` for easy use in an HTML string.
class Props {
  constructor(index, selectedIndex, baseClass) {
    this.id = `${baseClass}-result-${index}`
    this.class = `${baseClass}-result`
    this['data-result-index'] = index
    this.role = 'option'
    if (index === selectedIndex) {
      this['aria-selected'] = 'true'
    }
  }

  toString() {
    return Object.keys(this).reduce(
      (str, key) => `${str} ${key}="${this[key]}"`,
      ''
    )
  }
}

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
      onUpdate = () => {},
      baseClass = 'autocomplete',
      autocorrect = false,
      autoSelect,
      getResultValue = result => result,
      renderResult,
      debounceTime = 0,
      resultListLabel,
      submitOnEnter = false,
    } = {}
  ) {
    this.root = typeof root === 'string' ? document.querySelector(root) : root
    this.input = this.root.querySelector('input')
    this.resultList = this.root.querySelector('ul')
    this.baseClass = baseClass
    this.autocorrect = autocorrect
    this.getResultValue = getResultValue
    this.onUpdate = onUpdate
    if (typeof renderResult === 'function') {
      this.renderResult = renderResult
    }
    this.resultListLabel = resultListLabel
    this.submitOnEnter = submitOnEnter

    const core = new AutocompleteCore({
      search,
      autoSelect,
      setValue: this.setValue,
      setAttribute: this.setAttribute,
      onUpdate: this.handleUpdate,
      autocorrect: this.autocorrect,
      onSubmit,
      onShow: this.handleShow,
      onHide: this.handleHide,
      onLoading: this.handleLoading,
      onLoaded: this.handleLoaded,
      submitOnEnter: this.submitOnEnter,
    })
    if (debounceTime > 0) {
      core.handleInput = debounce(core.handleInput, debounceTime)
    }
    this.core = core

    this.initialize()
  }

  // Set up aria attributes and events
  initialize = () => {
    this.root.style.position = 'relative'

    this.input.setAttribute('role', 'combobox')
    this.input.setAttribute('autocomplete', 'off')
    this.input.setAttribute('autocapitalize', 'off')
    if (this.autocorrect) {
      this.input.setAttribute('autocorrect', 'on')
    }
    this.input.setAttribute('spellcheck', 'false')
    this.input.setAttribute('aria-autocomplete', 'list')
    this.input.setAttribute('aria-haspopup', 'listbox')
    this.input.setAttribute('aria-expanded', 'false')

    this.resultList.setAttribute('role', 'listbox')

    const resultListAriaLabel = getAriaLabel(this.resultListLabel)
    resultListAriaLabel &&
      this.resultList.setAttribute(
        resultListAriaLabel.attribute,
        resultListAriaLabel.content
      )

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

  destroy = () => {
    document.body.removeEventListener('click', this.handleDocumentClick)
    this.input.removeEventListener('input', this.core.handleInput)
    this.input.removeEventListener('keydown', this.core.handleKeyDown)
    this.input.removeEventListener('focus', this.core.handleFocus)
    this.input.removeEventListener('blur', this.core.handleBlur)
    this.resultList.removeEventListener(
      'mousedown',
      this.core.handleResultMouseDown
    )
    this.resultList.removeEventListener('click', this.core.handleResultClick)

    this.root = null
    this.input = null
    this.resultList = null
    this.getResultValue = null
    this.onUpdate = null
    this.renderResult = null
    this.core.destroy()
    this.core = null
  }

  setAttribute = (attribute, value) => {
    this.input.setAttribute(attribute, value)
  }

  setValue = result => {
    this.input.value = result ? this.getResultValue(result) : ''
  }

  renderResult = (result, props) =>
    `<li ${props}>${this.getResultValue(result)}</li>`

  handleUpdate = (results, selectedIndex) => {
    this.resultList.innerHTML = ''
    results.forEach((result, index) => {
      const props = new Props(index, selectedIndex, this.baseClass)
      const resultHTML = this.renderResult(result, props)
      if (typeof resultHTML === 'string') {
        this.resultList.insertAdjacentHTML('beforeend', resultHTML)
      } else {
        this.resultList.insertAdjacentElement('beforeend', resultHTML)
      }
    })

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
    this.onUpdate(results, selectedIndex)
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
