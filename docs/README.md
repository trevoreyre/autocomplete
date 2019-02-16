<h2 align="center">
  Autocomplete
</h2>
<p align="center">
  Accessible autocomplete component for vanilla JavaScript and Vue.
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@trevoreyre/autocomplete">
    <img src="https://img.shields.io/npm/v/@trevoreyre/autocomplete.svg?style=flat">
  </a>
  <a href="LICENSE">
    <img alt="undefined" src="https://img.shields.io/github/license/trevoreyre/autocomplete.svg?style=flat">
  </a>
</p>
<br>
<div id='autocomplete-demo'>
  <input class='autocomplete-input' placeholder='Search for a country' aria-label='Search for a country'>
  <ul class='autocomplete-results'></ul>
</div>

## Features

- Accessible, with full support for ARIA attributes and keyboard interactions. Based on the [WAI-ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox).
- Available as a [JavaScript][javascript-component] or [Vue component][vue-component], with React coming soon.
- [Core package][core-package] available if you want to bring your own rendering layer.
- Customizable. Easily bring your own CSS, or take full control of the component rendering.
- Support for asynchronous data fetching.

## Packages

Autocomplete is available as a JavaScript component, a Vue component, or a core package. See the docs on an individual package to learn more.

- [JavaScript component][javascript-component]
- [Vue component][vue-component]
- [Core package][core-package]

[version-badge]: https://img.shields.io/npm/v/@trevoreyre/autocomplete.svg?style=flat-square
[package]: https://www.npmjs.com/package/@trevoreyre/autocomplete
[license-badge]: https://img.shields.io/npm/l/@trevoreyre/autocomplete.svg?style=flat-square
[license]: https://github.com/trevoreyre/autocomplete/blob/master/LICENSE
[autocomplete-image]: autocomplete.png
[javascript-component]: javascript-component.md
[vue-component]: vue-component.md
[core-package]: core-package.md

<script>
new Autocomplete('#autocomplete-demo', {
  search: input => {
    if (input.length === 0) { return [] }
    return countries.filter(country =>
      country.toLowerCase().startsWith(input.toLowerCase())
    )
  },
  onSubmit: result => alert(`You selected ${result}`)
})
</script>
