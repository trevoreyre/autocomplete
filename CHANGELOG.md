# Changelog

## v2.4.0 (January 9, 2023)

### autocomplete-core

- Added `submitOnEnter` option to control whether or not results should be submitted immediately after selecting them by pressing <kbd>Enter</kbd> (dpxgit, [@dpxgit](https://github.com/dpxgit))

### autocomplete-js

- Added `resultListLabel` option to provide `aria-label` or `aria-labelledby` attribute for result list (dpxgit, [@dpxgit](https://github.com/dpxgit))

### autocomplete-vue

- Added `resultListLabel` prop to provide `aria-label` or `aria-labelledby` attribute for result list (dpxgit, [@dpxgit](https://github.com/dpxgit))

## v2.3.0 (November 2, 2022)

### autocomplete-js

- Fixed W3C validation error regarding the attribute `autocorrect` by changing it to be optional (dpxgit, [@dpxgit](https://github.com/dpxgit))

## v2.2.0 (May 28, 2020)

### autocomplete-vue

- Added `update` event when the results list is updated (Ben Roth, [@ben-roth-](https://github.com/ben-roth-))

### autocomplete-js

- Added `onUpdate` event when the results list is updated (Ben Roth, [@ben-roth-](https://github.com/ben-roth-))

## v2.1.1 (February 24, 2020)

- Updated storybook to v5.3. Updated stories to new format.
- Updated dev dependencies

## v2.1.0 (January 10, 2020)

- Added debounceTime prop for async search functions (Justin, [@jssouders](https://github.com/jssouders))

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
