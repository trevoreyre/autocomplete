import { LitElement, css, html } from 'lit-element'
import customEvent from './util/customEvent.js'
import uniqueId from './util/uniqueId.js'
import store, { initialize } from './store.js'

class AutocompleteOption extends LitElement {
  static get properties() {
    return {
      id: { type: String, reflect: true },
      value: { type: String, reflect: true },
      hidden: { type: Boolean, reflect: true },
      ariaSelected: { attribute: 'aria-selected', type: String, reflect: true },
      role: { type: String, reflect: true },
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none;
      }
    `
  }

  constructor() {
    super()
    this.id = uniqueId('autocomplete-option-')
    this.role = 'option'
    this.hidden = true
  }

  connectedCallback() {
    super.connectedCallback()
  }

  render() {
    return html`
      <slot></slot>
    `
  }
}

class ConnectedAutocompleteOption extends AutocompleteOption {
  #unsubscribe = () => {}

  connectedCallback() {
    super.connectedCallback()
    this.#unsubscribe = store.subscribe(() =>
      this.stateChanged(store.getState())
    )
    initialize({
      id: this.id,
      type: 'option',
      value: this.value || this.textContent.trim(),
    })
    this.dispatchEvent(customEvent('register', { id: this.id, type: 'option' }))
  }

  disconnectedCallback() {
    this.#unsubscribe()
    super.disconnectedCallback()
  }

  stateChanged(state) {
    this.hidden = !state[this.id].visible
    // this.ariaSelected = state[this.id].selected
  }
}

export default ConnectedAutocompleteOption
export { AutocompleteOption }
