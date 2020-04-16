import { html } from 'lit-element'

export default {
  title: 'Autocomplete',
  component: 'autocomplete',
}

export const basic = () => html`
  <autocomplete-root>
    <autocomplete-input></autocomplete-input>
    <autocomplete-list>
      ${window.countries.map(
        country => html`
          <autocomplete-option>${country}</autocomplete-option>
        `
      )}
    </autocomplete-list>
  </autocomplete-root>
`

export const defaultValue = () => html`
  <autocomplete-root>
    <autocomplete-input value="aus"></autocomplete-input>
    <autocomplete-list>
      ${window.countries.map(
        country => html`
          <autocomplete-option>${country}</autocomplete-option>
        `
      )}
    </autocomplete-list>
  </autocomplete-root>
`

export const customFilter = () => {
  const filter = (option, value) =>
    option.toLowerCase().startsWith(value.toLowerCase())

  return html`
    <autocomplete-root .filter=${filter}>
      <autocomplete-input></autocomplete-input>
      <autocomplete-list>
        ${window.countries.map(
          country => html`
            <autocomplete-option>${country}</autocomplete-option>
          `
        )}
      </autocomplete-list>
    </autocomplete-root>
  `
}

// <autocomplete-root .filter=${() => true}>
// <autocomplete-root filter="false">
// <autocomplete-root disable-filter>
// <autocomplete-root no-filter>
// <autocomplete-root nofilter>
export const disableFilter = () => html`
  <autocomplete-root disable-filter>
    <autocomplete-input value="aus"></autocomplete-input>
    <autocomplete-list>
      ${window.countries.map(
        country => html`
          <autocomplete-option>${country}</autocomplete-option>
        `
      )}
    </autocomplete-list>
  </autocomplete-root>
`

export const selectEvent = () => {
  const handleSelect = event => {
    const { value, type } = event.detail
    if (type === 'Tab') {
      console.log(`Selected ${value}`)
    } else if (type === 'Enter') {
      alert(`Selected ${value}`)
    } else if (type === 'Click') {
      alert(`Clicked ${value}`)
    }
  }

  return html`
    <autocomplete-root @select=${handleSelect}>
      <autocomplete-input value="aus"></autocomplete-input>
      <autocomplete-list>
        ${window.countries.map(
          country => html`
            <autocomplete-option>${country}</autocomplete-option>
          `
        )}
      </autocomplete-list>
    </autocomplete-root>
  `
}
