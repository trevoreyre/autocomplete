## v2.0.4 (December 22, 2019)

- Fix: Reverted back to autocomplete="off" to disable browser auto-fill
- Documentation: Fixed some typos (Tadeusz Stępnikowski, [@versedi](https://github.com/versedi))
- Documentation: Updated slot syntax in Vue examples

## v2.0.3 (November 1, 2019)

- Fix: Set autocomplete attribute to "disabled-autocomplete" to disable auto-fill in Chrome (Iago Leão, [@iagoleao](https://github.com/iagoleao))

## v2.0.2 (June 25, 2019)

### autocomplete-vue

- Fix: Include extra attributes in `inputProps` when using default slot

## v2.0.1 (June 25, 2019)

### autocomplete-vue

- Fix: Compute `aria-activedescendant` attribute properly

## v2.0.0 (June 21, 2019)

- BREAKING: Changed default class for results list from `autocomplete-results` to `autocomplete-result-list`
- BREAKING: Changed default ID for results list from `autocomplete-results-{id}` to `autocomplete-result-list-{id}`
- BREAKING: Call `search` function on focus

### autocomplete-vue

- BREAKING: Updated default slot to control template for entire component
- BREAKING: Added new slot called `result` to control template for a single result item
- BREAKING: Removed `onSubmit` prop to use custom `submit` event instead

### autocomplete-js

- BREAKING: Removed `renderResults` option and replaced with `renderResult`, which can be used to control rendering of a single result item. This function can return either a DOM element or an HTML string.

## v1.0.2 (May 1, 2019)

### autocomplete-vue

- Fix: Added support for input events

## v1.0.1 (April 5, 2019)

- Updated internal tooling

## v1.0.0 (February 22, 2019)

Initial release
