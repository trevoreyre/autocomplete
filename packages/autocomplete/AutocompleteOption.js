import { LitElement, css, html } from 'lit-element'
import customEvent from './util/customEvent.js'
import uniqueId from './util/uniqueId.js'
import store from './store.js'

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
    this.dispatchEvent(
      customEvent('initialize', {
        id: this.id,
        value: this.value || this.textContent.trim(),
      })
    )
  }

  render() {
    return html`
      <slot></slot>
    `
  }
}

class ConnectedAutocompleteOption extends AutocompleteOption {
  unsubscribe = () => {}

  connectedCallback() {
    super.connectedCallback()
    this.unsubscribe = store.subscribe(() =>
      this.stateChanged(store.getState())
    )
    this.stateChanged(store.getState())
  }

  disconnectedCallback() {
    this.unsubscribe()
    super.disconnectedCallback()
  }

  stateChanged(state) {
    this.hidden = !state[this.id].value
    this.ariaSelected = state[this.id].selected
  }
}

export default ConnectedAutocompleteOption
export { AutocompleteOption }
