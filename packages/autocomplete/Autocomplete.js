import { LitElement, css, html } from 'lit-element'
import { customEvent, defaultFilter, uniqueId } from './util/index.js'
import store, {
  hide,
  initialize,
  register,
  select,
  selectNext,
  selectPrev,
} from './store.js'

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
    document.addEventListener('click', this.handleDocumentClick.bind(this))
  }

  connectedCallback() {
    super.connectedCallback()
    this.#unsubscribe = store.subscribe(() =>
      this.stateChanged(store.getState())
    )
    initialize({
      id: this.#id,
      type: 'provider',
      filter: this.disableFilter ? () => true : this.filter,
    })
  }

  disconnectedCallback() {
    this.#unsubscribe()
    document.removeEventListener('click', this.handleDocumentClick)
    super.disconnectedCallback()
  }

  handleRegister(event) {
    event.stopPropagation()
    const { id, type } = event.detail
    register({ id, type, providerId: this.#id })
  }

  handleDocumentClick(event) {
    if (this.contains(event.target)) {
      return
    }
    hide({ providerId: this.#id })
  }

  handleKeyDown(event) {
    const { key } = event
    switch (key) {
      case 'Up': // IE/Edge
      case 'ArrowUp': {
        selectPrev({ providerId: this.#id })
        break
      }
      case 'Down': // IE/Edge
      case 'ArrowDown': {
        selectNext({ providerId: this.#id })
        break
      }
      case 'Esc': // IE/Edge
      case 'Escape': {
        hide({ providerId: this.#id })
        break
      }
      case 'Enter': {
        select({ providerId: this.#id, type: 'Enter' })
        break
      }
      case 'Tab': {
        select({ providerId: this.#id, type: 'Tab' })
        break
      }
    }
  }

  stateChanged(state) {
    const provider = state[this.#id]
    if (provider.selected) {
      this.dispatchEvent(
        customEvent('select', {
          value: provider.value,
          type: provider.selectType,
        })
      )
    }
  }
}

export default ConnectedAutocomplete
export { Autocomplete }
