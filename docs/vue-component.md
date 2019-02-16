# Vue component

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

To add the default styling for the component, include the CSS file on your page as well.

```html
<link rel="stylesheet" href="https://unpkg.com/@trevoreyre/autocomplete-vue/dist/style.css">
```

## Usage

# TODO

<iframe height="496" style="width: 100%;" scrolling="no" title="Basic Autocomplete" src="//codepen.io/trevoreyre/embed/NoBKKp/?height=496&theme-id=36113&default-tab=html,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/trevoreyre/pen/NoBKKp/'>Basic Autocomplete</a> by Trevor Eyre
  (<a href='https://codepen.io/trevoreyre'>@trevoreyre</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Props

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| [`search`](#search) | Function (required) | | The search funtion to be executed on user input. Can be a synchronous function or a `Promise`. |
| [`onSubmit`](#onsubmit) | Function | | Executed on input submission |
| [`baseClass`](#baseclass) | String | `'autocomplete'` | Base class used to create classes and IDs for generated DOM elements |
| [`autoSelect`](#autoselect) | Boolean | `false` | Controls whether first result should be highlighted after input |
| [`getResultValue`](#getresultvalue) | Function | | For complex search results, this function is executed to get the value to display in the input |
| [`defaultValue`](#defaultvalue) | String | | Initial value of the component |

#### search

The `search` function is executed on user input. It is expected to return either an array of results to be rendered, or a `Promise` that resolves to an array of results.

In the simplest case, `search` can return an array of strings.

# TODO

<iframe height="496" style="width: 100%;" scrolling="no" title="Basic Autocomplete" src="//codepen.io/trevoreyre/embed/NoBKKp/?height=496&theme-id=36113&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/trevoreyre/pen/NoBKKp/'>Basic Autocomplete</a> by Trevor Eyre
  (<a href='https://codepen.io/trevoreyre'>@trevoreyre</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The `search` function can also return a `Promise`, to make asynchronous calls to an API, for example. The return value doesn't have to be an array of strings, it can also be an array of objects. In this case, you will need to provide a `getResultValue` function to get the raw value from your result object to display in the `input` field when a user selects or submits a result.

Below is a more advanced search example showing these options.

# TODO

<iframe height="496" style="width: 100%;" scrolling="no" title="Advanced autocomplete searchh" src="//codepen.io/trevoreyre/embed/RvBvRN/?height=496&theme-id=36113&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/trevoreyre/pen/RvBvRN/'>Advanced autocomplete searchh</a> by Trevor Eyre
  (<a href='https://codepen.io/trevoreyre'>@trevoreyre</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

#### onSubmit

The `onSubmit` function is executed when the user submits their result by either selecting a result from the list, or pressing `enter/return`. The function receives the selected result as an argument.

# TODO

<iframe height="496" style="width: 100%;" scrolling="no" title="Autocomplete onSubmit" src="//codepen.io/trevoreyre/embed/MLBNBp/?height=496&theme-id=36113&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/trevoreyre/pen/MLBNBp/'>Autocomplete onSubmit</a> by Trevor Eyre
  (<a href='https://codepen.io/trevoreyre'>@trevoreyre</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

#### baseClass

The `baseClass` option is used to derive classes for generated DOM elements in the results list. It's also used to create IDs when necessary for use in ARIA attributes.

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

This option can be useful if you need a certain class in your DOM for styling purposes. See the section on [Styling and customization](#styling-and-customization) for more info.

#### autoSelect

If the `autoSelect` option is set to `true`, the first result in the list will automatically be highlighted after user input.

# TODO

<iframe height="496" style="width: 100%;" scrolling="no" title="Autocomplete autoSelect" src="//codepen.io/trevoreyre/embed/XOPrjB/?height=496&theme-id=36113&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/trevoreyre/pen/XOPrjB/'>Autocomplete autoSelect</a> by Trevor Eyre
  (<a href='https://codepen.io/trevoreyre'>@trevoreyre</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

#### getResultValue

If your search function returns more complex results like an array of objects, you can use the `getResultValue` function to tell the autocomplete component what value to display in the results list and input. The function receives a result as an argument, and is expected to return a `String` to display for that result.

# TODO

<iframe height="496" style="width: 100%;" scrolling="no" title="Autocomplete getResultValue" src="//codepen.io/trevoreyre/embed/RvYwVZ/?height=496&theme-id=36113&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/trevoreyre/pen/RvYwVZ/'>Autocomplete getResultValue</a> by Trevor Eyre
  (<a href='https://codepen.io/trevoreyre'>@trevoreyre</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

#### defaultValue

# TODO

## Slots

# TODO

## Styling and customization

To include the default styling of the autocomplete component that you see here in the docs, include the CSS file on your page.

```html
<link rel="stylesheet" href="https://unpkg.com/@trevoreyre/autocomplete-vue/dist/style.css">
```

This styling is intentionally opinionated, however, it's relatively easy to write your own CSS if you want a different style. All positional styling is handled inline, so you don't have to worry about positioning the results list in your CSS. Below is an example of what the component looks like completely unstyled.

# TODO

<iframe height="496" style="width: 100%;" scrolling="no" title="Unstyled autocomplete" src="//codepen.io/trevoreyre/embed/gqBQGm/?height=496&theme-id=36113&default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/trevoreyre/pen/gqBQGm/'>Unstyled autocomplete</a> by Trevor Eyre
  (<a href='https://codepen.io/trevoreyre'>@trevoreyre</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The IDs and classes of the component can be customized using the [`baseClass`](#baseclass) option. If you need more control than the `baseClass` option can provide, you can also take full control of the rendering of your results list using [slots](#slots).

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
