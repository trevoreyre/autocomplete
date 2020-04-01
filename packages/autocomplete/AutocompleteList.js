import { LitElement, css, html } from 'lit-element'
import customEvent from './util/customEvent.js'
import uniqueId from './util/uniqueId.js'
import store from './store.js'

class AutocompleteList extends LitElement {
  static get properties() {
    return {
      id: { type: String, reflect: true },
      role: { type: String, reflect: true },
      hidden: { type: Boolean, reflect: true },
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
    this.id = uniqueId('autocomplete-list-')
    this.role = 'listbox'
    this.hidden = true
  }

  connectedCallback() {
    super.connectedCallback()
    this.dispatchEvent(
      customEvent('initialize-list', {
        id: this.id,
      })
    )
  }

  render() {
    return html`
      <slot></slot>
    `
  }
}

class ConnectedAutocompleteList extends AutocompleteList {
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
    this.hidden = !state[this.id]
  }
}

export default ConnectedAutocompleteList
export { AutocompleteList }
