import { LitElement, css, html } from 'lit-element'
import customEvent from './util/customEvent.js'
import uniqueId from './util/uniqueId.js'
import store, { hide, initialize, input } from './store.js'

class AutocompleteInput extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
      }

      input {
        display: inline-block;
        font-size: inherit;
        appearance: none;
        border: none;
        background: transparent;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: inherit;
        margin: inherit;
        outline: none;
        box-sizing: border-box;
      }
    `
  }

  static get properties() {
    return {
      id: { type: String, reflect: true },
      list: { type: String, reflect: true },
      value: { type: String, reflect: true },
      role: { type: String, reflect: true },
      autocomplete: { type: String, reflect: true },
      autocapitalize: { type: String, reflect: true },
      autocorrect: { type: String, reflect: true },
      spellcheck: { type: String, reflect: true },
      ariaAutocomplete: {
        type: String,
        attribute: 'aria-autocomplete',
        reflect: true,
      },
      ariaHasPopup: { type: String, attribute: 'aria-haspopup', reflect: true },
      ariaOwns: { type: String, attribute: 'aria-owns', reflect: true },
      ariaExpanded: { type: String, attribute: 'aria-expanded', reflect: true },
      ariaActiveDescendant: {
        type: String,
        attribute: 'aria-activedescendant',
        reflect: true,
      },
    }
  }

  constructor() {
    super()
    this.id = uniqueId('autocomplete-input-')
    this.value = ''
    this.role = 'combobox'
    this.autocomplete = 'off'
    this.autocapitalize = 'off'
    this.autocorrect = 'off'
    this.spellcheck = 'false'
    this.ariaAutocomplete = 'list'
    this.ariaHasPopup = 'listbox'
    this.ariaExpanded = 'false'
  }

  handleInput(event) {
    this.value = event.target.value
  }

  handleBlur() {
    hide({ id: this.id })
  }

  render() {
    return html`
      <input
        .value=${this.value}
        autocomplete=${this.autocomplete}
        autocapitalize=${this.autocapitalize}
        autocorrect=${this.autocorrect}
        spellcheck=${this.spellcheck}
        @input=${this.handleInput}
        @blur=${this.handleBlur}
      />
    `
  }
}

class ConnectedAutocompleteInput extends AutocompleteInput {
  #unsubscribe = () => {}

  connectedCallback() {
    super.connectedCallback()
    this.#unsubscribe = store.subscribe(() =>
      this.stateChanged(store.getState())
    )
    initialize({
      id: this.id,
      type: 'input',
      value: this.value,
    })
    this.dispatchEvent(customEvent('register', { id: this.id, type: 'input' }))
  }

  disconnectedCallback() {
    this.#unsubscribe()
    super.disconnectedCallback()
  }

  stateChanged(state) {
    this.value = state[this.id].value ?? this.value
  }

  handleInput(event) {
    super.handleInput(event)
    input({ id: this.id, value: this.value })
  }
}

export default ConnectedAutocompleteInput
export { AutocompleteInput }
