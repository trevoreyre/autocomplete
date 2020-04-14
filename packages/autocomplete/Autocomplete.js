import { LitElement, css, html } from 'lit-element'
import { defaultFilter, uniqueId } from './util/index.js'
import store, { initialize, register } from './store.js'

class Autocomplete extends LitElement {
  value = ''

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `
  }

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

  constructor() {
    super()
    this.filter = defaultFilter
  }

  render() {
    return html`
      <slot></slot>
    `
  }
}

class ConnectedAutocomplete extends Autocomplete {
  #unsubscribe = () => {}
  #id = uniqueId('autocomplete-')

  constructor() {
    super()
    this.addEventListener('register', this.handleRegister)
    this.addEventListener('keydown', this.handleKeyDown)
  }

  connectedCallback() {
    super.connectedCallback()
    this.#unsubscribe = store.subscribe(() => {})
    initialize({
      id: this.#id,
      type: 'provider',
      filter: this.disableFilter ? () => true : this.filter,
    })
  }

  disconnectedCallback() {
    this.#unsubscribe()
    super.disconnectedCallback()
  }

  handleRegister(event) {
    event.stopPropagation()
    const { id, type } = event.detail
    register({ id, type, providerId: this.#id })
  }

  handleInitializeList(event) {
    event.stopPropagation()
    this.list = event.detail.id
  }

  handleKeyDown(event) {
    // const { key } = event
    // const lastSelectedOption = this.selectedOption
    // const count = this.visibleOptions.length
    // switch (key) {
    //   case 'Up': // IE/Edge
    //   case 'ArrowUp': {
    //     this.selectedIndex =
    //       (((this.selectedIndex - 1) % count) + count) % count
    //     break
    //   }
    //   case 'Down': // IE/Edge
    //   case 'ArrowDown': {
    //     this.selectedIndex =
    //       (((this.selectedIndex + 1) % count) + count) % count
    //     break
    //   }
    //   //   const selectedIndex =
    //   //     key === 'ArrowUp' || key === 'Up'
    //   //       ? this.selectedIndex - 1
    //   //       : this.selectedIndex + 1
    //   //   event.preventDefault()
    //   //   this.handleArrows(selectedIndex)
    //   //   break
    // }
    // this.selectedOption = this.visibleOptions[this.selectedIndex]
    // if (this.selectedOption) {
    //   setSelectedOption({
    //     id: this.selectedOption.id,
    //     lastId: lastSelectedOption ? lastSelectedOption.id : '',
    //   })
    // }
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
