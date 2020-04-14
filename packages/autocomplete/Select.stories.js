import { html } from 'lit-element'

export default {
  title: 'Select',
}

export const basic = () => html`
  <select>
    ${window.countries.map(
      country =>
        html`
          <option>${country}</option>
        `
    )}
  </select>
`

export const defaultSelected = () => html`
  <select>
    ${window.countries.map(
      (country, index) => html`
        <option ?selected=${index === 20}>${country}</option>
      `
    )}
  </select>
`
