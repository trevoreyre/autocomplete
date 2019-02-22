# @trevoreyre/autocomplete-vue

## Demo

Take a look at the [documentation page](https://autocomplete.trevoreyre.com), and the [Codepen examples](https://codepen.io/collection/nLLLyx/).

## Installation

Install the component from npm.

```bash
npm install --save @trevoreyre/autocomplete-vue
```

Or using yarn.

```bash
yarn add @trevoreyre/autocomplete-vue
```

You can also use the browser bundle in a script tag.

```html
<script src="https://unpkg.com/@trevoreyre/autocomplete-vue"></script>
```

## Usage

Import the autocomplete component and register it globally in your Vue app. Import the CSS as well if you wish to use the default styling.

```js
import Vue from 'vue'
import Autocomplete from '@trevoreyre/autocomplete-vue'
import '@trevoreyre/autocomplete-vue/dist/style.css'

Vue.use(Autocomplete)
```

You can also import autocomplete locally in your component if you prefer.

```js
import Autocomplete from '@trevoreyre-autocomplete-vue'

export default {
  name: 'my-component',
  ...
  components: {
    Autocomplete
  }
  ...
}
```

Then, use the component in your app.

```html
<autocomplete :search="search"></autocomplete>
```

## Props

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| [`search`](#search) | Function (required) | | The search funtion to be executed on user input. Can be a synchronous function or a `Promise`. |
| [`onSubmit`](#onsubmit) | Function | | Executed on input submission |
| [`baseClass`](#baseclass) | String | `'autocomplete'` | Base class used to create classes and IDs for generated DOM elements |
| [`autoSelect`](#autoselect) | Boolean | `false` | Controls whether first result should be highlighted after input |
| [`getResultValue`](#getresultvalue) | Function | | For complex search results, this function is executed to get the value to display in the input |
| [`defaultValue`](#defaultvalue) | String | | Initial value of the component |

**Note:** Any extra props you pass will be spread on the `input` element of the autocomplete component.

#### search

The `search` function is executed on user input. It is expected to return either an array of results to be rendered, or a `Promise` that resolves to an array of results.

In the simplest case, `search` can return an array of strings.

```js
search(input) {
  if (input.length < 1) { return [] }
  return countries.filter(country => {
    return country.toLowerCase()
      .startsWith(input.toLowerCase())
  })
}
```

The `search` function can also return a `Promise`, to make asynchronous calls to an API, for example. The return value doesn't have to be an array of strings, it can also be an array of objects. In this case, you will need to provide a `getResultValue` function to get the raw value from your result object to display in the `input` field when a user selects or submits a result.

Below is a more advanced search example showing these props.

```html
<div id="app">
  <autocomplete
    :search="search"
    placeholder="Search Wikipedia"
    aria-label="Search Wikipedia"
    :get-result-value="getResultValue"
    :on-submit="onSubmit"
  ></autocomplete>
</div>
```

```js
const wikiUrl = 'https://en.wikipedia.org'
const params = 'action=query&list=search&format=json&origin=*'

new Vue({
  el: '#app',
  components: {
    Autocomplete
  },
  data: {

    // Search function can return a promise
    // which resolves with an array of
    // results. In this case we're using
    // the Wikipedia search API.
    search(input) {
      const url = `${wikiUrl}/w/api.php?${
        params
      }&srsearch=${encodeURI(input)}`

      return new Promise(resolve => {
        if (input.length < 3) {
          return resolve([])
        }

        fetch(url)
          .then(response => response.json())
          .then(data => {
            resolve(data.query.search)
          })
      })
    },

    // Wikipedia returns a format like this:
    //
    // {
    //   pageid: 12345,
    //   title: 'Article title',
    //   ...
    // }
    //
    // We want to display the title
    getResultValue(result) {
      return result.title
    },

    // Open the selected article in
    // a new window
    onSubmit(result) {
      window.open(`${wikiUrl}/wiki/${
        encodeURI(result.title)
      }`)
    }
  }
})
```

#### onSubmit

The `onSubmit` function is executed when the user submits their result by either selecting a result from the list, or pressing `enter/return`. The function receives the selected result as an argument.

```js
onSubmit(result) {
  alert(`You selected ${result}`)
}
```

#### baseClass

The `baseClass` prop is used to derive classes for generated DOM elements in the results list. It's also used to create IDs when necessary for use in ARIA attributes.

For example, if you passed a `baseClass` of `'search'`:

```html
<autocomplete base-class="search"></autocomplete>
```

You would get the following DOM (simplified for demonstration purposes):

```html
<div class="search">
  <input class="search-input">
  <ul id="search-results-1" class="search-results">
    <li id="search-result-0" class="search-result">
      First result
    </li>
    <li id="search-result-1" class="search-result">
      Second result
    </li>
  </ul>
</div>
```

This prop can be useful if you need a certain class in your DOM for styling purposes. See the section on [Styling and customization](#styling-and-customization) for more info.

#### autoSelect

If the `autoSelect` prop is set to `true`, the first result in the list will automatically be highlighted after user input.

```html
<autocomplete :search="search" auto-select></autocomplete>
```

#### getResultValue

If your search function returns more complex results like an array of objects, you can use the `getResultValue` function to tell the autocomplete component what value to display in the results list and input. The function receives a result as an argument, and is expected to return a `String` to display for that result.

```js
// Results come back in the format:
//
// {
//   name: 'lion',
//   collateral_adjectives: [
//     'leonine',
//     'lionish'
//   ]
// }
//
// We want to display the name
getResultValue(result) {
  return result.name
}
```

#### defaultValue

The `defaultValue` prop can be used to set the initial value of the `input` field.

```html
<autocomplete :search="search" default-value="some value..."></autocomplete>
```

## Slots

A default slot is provided if you need to take full control of the rendering of your results list. Using [scoped slots](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots), you can access the following data in your slot.

- `results` - The list of results returned from your `search` function.
- `resultProps` - A list of props for each result item. Each item in the list is an object of attributes that you can `v-bind` on your `li` element. This way, you don't have to worry about generating the proper IDs, classes, and ARIA attributes yourself.

```html
<autocomplete
  :search="search"
  placeholder="Search Wikipedia"
  aria-label="Search Wikipedia"
  :get-result-value="getResultValue"
  :on-submit="onSubmit"
>
  <template v-slot="{ results, resultProps }">
    <li
      v-for="(result, index) in results"
      v-bind="resultProps[index]"
      :key="'autocomplete-result-' + index"
    >
      <div class="wiki-title">
        {{ result.title }}
      </div>
      <div
        class="wiki-snippet"
        v-html="result.snippet"
      ></div>
    </li>
  </template>
</autocomplete>
```

## Styling and customization

To include the default styling of the autocomplete component that you see here in the docs, include the CSS file on your page.

```html
<link rel="stylesheet" href="https://unpkg.com/@trevoreyre/autocomplete-vue/dist/style.css">
```

Or import it into your app.

```js
import '@trevoreyre/autocomplete-vue/dist/style.css'
```

This styling is intentionally opinionated, however, it's relatively easy to write your own CSS if you want a different style. All positional styling is handled inline, so you don't have to worry about positioning the results list in your CSS.

The IDs and classes of the component can be customized using the [`baseClass`](#baseclass) prop. If you need more control than the `baseClass` prop can provide, you can also take full control of the rendering of your results list using [slots](#slots).

Below is an example of a typical DOM structure, and all the properties that might be relevant for styling.

```html
<div
  id="autocomplete"
  class="autocomplete"
  data-expanded="true"
  data-loading="false"
  data-position="below"
>
  <input class="autocomplete-input" aria-expanded="true">
  <ul id="autocomplete-results-1" class="autocomplete-results">
    <li
      id="autocomplete-result-0"
      class="autocomplete-result"
      data-result-index="0"
      aria-selected="true"
    >
      First result
    </li>
    <li
      id="autocomplete-result-1"
      class="autocomplete-result"
      data-result-index="1"
    >
      Second result
    </li>
  </ul>
</div>
```

There are a few data attributes that are added to the root element as well to show the current state of the component.

- `data-expanded="true"` - This is added when the results list is open
- `data-loading="true"` - This is added if your `search` function is a `Promise`, and hasn't resolved yet
- `data-position="below"` - This shows if the results list is positioned `above` or `below` the `input` element

In addition, an `aria-expanded` attribute is added to the `input` element, and `aria-selected` is added to the currently selected `li` element.

Below is an example of how you could use these attributes in your CSS.

```css
/* Change border if results are above input */
[data-position="above"] .autocomplete-results {
  border-bottom: none;
  border-radius: 8px 8px 0 0;
}
```
