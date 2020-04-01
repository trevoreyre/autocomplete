import { LitElement, css, html } from 'lit-element'
import customEvent from './util/customEvent.js'
import uniqueId from './util/uniqueId.js'

class AutocompleteInput extends LitElement {
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

  static get styles() {
    return css`
      :host {
        /* display: inline-block; */
        position: relative;

        -webkit-writing-mode: horizontal-tb !important;

        margin: 0;
        font: -webkit-small-control;
        color: initial;
        letter-spacing: normal;
        word-spacing: normal;
        line-height: normal;
        text-transform: none;
        text-indent: 0;
        text-shadow: none;
        display: inline-block;
        text-align: start;

        border-radius: 5px;

        -webkit-appearance: menulist;
        box-sizing: border-box;
        align-items: center;
        border: 1px solid;
        white-space: pre;
        -webkit-rtl-ordering: logical;
        color: black;
        background-color: white;
        cursor: default;

        -webkit-appearance: listbox;
        -webkit-appearance: menulist;
        appearance: menulist;
        align-items: flex-start;
        border: 1px inset gray;
        border-radius: initial;
        overflow-x: hidden;
        overflow-y: scroll;
        vertical-align: text-bottom;
        -webkit-user-select: none;
        white-space: nowrap;

        height: 14px;
        width: 100%;
      }

      :host([disabled]) {
        color: GrayText;
      }

      input {
        /* font-size: inherit;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        box-sizing: border-box;
        padding: inherit;
        border: none;
        background: transparent; */
        appearance: none;
        border: none;
        background: transparent;
        padding: 0;
        margin: 0;
        outline: none;
      }
    `
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

  connectedCallback() {
    super.connectedCallback()
    this.dispatchEvent(
      new Event('input', { bubbles: true, cancelable: true, composed: true })
    )
  }

  handleInput = event => {
    this.value = event.target.value
  }

  render() {
    return html`
      <input
        value=${this.value}
        autocomplete=${this.autocomplete}
        autocapitalize=${this.autocapitalize}
        autocorrect=${this.autocorrect}
        spellcheck=${this.spellcheck}
        @input=${this.handleInput}
      />
    `
  }
}

export default AutocompleteInput
