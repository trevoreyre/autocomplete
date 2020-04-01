import { LitElement, css, html } from 'lit-element'
import { defaultFilter, uniqueId } from './util/index.js'
import store, { updateList, updateOptions, setSelectedOption } from './store.js'

class Autocomplete extends LitElement {
  value = ''

  static get properties() {
    return {
      id: { type: String, reflect: true },
      filter: { type: Function },
      disableFilter: {
        type: Boolean,
        attribute: 'disable-filter',
        reflect: true,
      },
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
        height: 40px;
      }
    `
  }

  constructor() {
    super()
    this.id = uniqueId('autocomplete-')
    this.filter = defaultFilter
  }

  render() {
    return html`
      <slot></slot>
    `
  }
}

class ConnectedAutocomplete extends Autocomplete {
  unsubscribe = () => {}
  options = []
  visibleOptions = []
  list = null
  selectedIndex = -1
  selectedOption = null

  constructor() {
    super()
    this.addEventListener('initialize', this.handleInitialize)
    this.addEventListener('initialize-list', this.handleInitializeList)
    this.addEventListener('input', this.handleInput)
    this.addEventListener('keydown', this.handleKeyDown)
  }

  connectedCallback() {
    super.connectedCallback()
    this.unsubscribe = store.subscribe(() => {})
  }

  disconnectedCallback() {
    this.unsubscribe()
    super.disconnectedCallback()
  }

  handleInitialize(event) {
    event.stopPropagation()
    this.options.push(event.detail)
    this.updateOptions()
  }

  handleInitializeList(event) {
    event.stopPropagation()
    this.list = event.detail.id
  }

  handleInput(event) {
    this.value = event.target.value
    this.updateOptions()
  }

  handleKeyDown(event) {
    const { key } = event
    console.log(`handleKeyDown, ${key}`)
    const lastSelectedOption = this.selectedOption

    switch (key) {
      case 'Up': // IE/Edge
      case 'ArrowUp': {
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0)
        break
      }
      case 'Down': // IE/Edge
      case 'ArrowDown': {
        this.selectedIndex = Math.min(
          this.selectedIndex + 1,
          this.visibleOptions.length - 1
        )
        break
      }
      //   const selectedIndex =
      //     key === 'ArrowUp' || key === 'Up'
      //       ? this.selectedIndex - 1
      //       : this.selectedIndex + 1
      //   event.preventDefault()
      //   this.handleArrows(selectedIndex)
      //   break
    }
    console.log(this.selectedIndex)
    this.selectedOption = this.visibleOptions[this.selectedIndex]
    if (this.selectedOption) {
      setSelectedOption({
        id: this.selectedOption.id,
        lastId: lastSelectedOption ? lastSelectedOption.id : '',
      })
    }
  }

  updateOptions() {
    const options = this.options.map(option => ({
      id: option.id,
      value: this.disableFilter ? true : this.filter(option.value, this.value),
    }))
    this.visibleOptions = options.filter(option => option.value === true)
    const listIsVisible = this.visibleOptions.length
    this.selectedIndex = -1
    updateOptions({ options })
    updateList({ id: this.list, value: listIsVisible })
  }
}

export default ConnectedAutocomplete
export { Autocomplete }
