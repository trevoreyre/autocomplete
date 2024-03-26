<h2 align="center">
  Autocomplete
</h2>

<p align="center">
  Accessible autocomplete component for vanilla JavaScript and Vue 3.
</p>

<p align="center">
  <a class="badge" href="https://www.npmjs.com/package/@trevoreyre/autocomplete">
    <img src="https://img.shields.io/npm/v/@trevoreyre/autocomplete.svg?style=flat">
  </a>
  <a class="badge" href="https://github.com/trevoreyre/autocomplete/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/trevoreyre/autocomplete.svg?style=flat">
  </a>
</p>

<div id='autocomplete-demo' class='autocomplete'>
  <input class='autocomplete-input' placeholder='Search for a country' aria-label='Search for a country'>
  <ul class='autocomplete-result-list'></ul>
</div>

## Features

- Accessible, with full support for ARIA attributes and keyboard interactions. Based on the [WAI-ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox).
- Available as a [JavaScript][javascript-component] or [Vue component][vue-component], with React coming soon. For Vue.js 2.x support please use the latest 2.x release of this package.
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
  }
})
</script>
