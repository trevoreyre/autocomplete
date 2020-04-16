import { LitElement, css, html } from 'lit-element'
import customEvent from './util/customEvent.js'
import uniqueId from './util/uniqueId.js'
import store, { initialize } from './store.js'

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

  render() {
    return html`
      <slot></slot>
    `
  }
}

class ConnectedAutocompleteList extends AutocompleteList {
  #unsubscribe = () => {}

  constructor() {
    super()
    this.addEventListener('mousedown', this.handleMouseDown)
  }

  connectedCallback() {
    super.connectedCallback()
    this.#unsubscribe = store.subscribe(() =>
      this.stateChanged(store.getState())
    )
    initialize({ id: this.id, type: 'list' })
    this.dispatchEvent(customEvent('register', { id: this.id, type: 'list' }))
  }

  disconnectedCallback() {
    this.#unsubscribe()
    super.disconnectedCallback()
  }

  stateChanged(state) {
    this.hidden = !state[this.id].expanded
  }

  handleMouseDown(event) {
    event.preventDefault()
  }
}

export default ConnectedAutocompleteList
export { AutocompleteList }
