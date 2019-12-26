# Release Process

Release versions follow [Semver](https://semver.org/). To create a new release, use the following process.

1. Commit and push changes on a feature branch, and create a pull request against `master`. Include updates to the `CHANGELOG`.

2. After merging changes, run `lerna version` on `master` to increment version numbers and tag the release.

3. In GitHub, create a release from the new tag in the following format.

Title:

```
v2.0.0
```

Description (copy directly from `CHANGELOG`):

```md
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
```

After creating the release, a GitHub action will run to publish the release to npm.
