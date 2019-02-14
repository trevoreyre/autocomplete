# JavaScript component

## Installation

Install the component from npm.

```bash
npm install --save @trevoreyre/autocomplete-js
```

Or using yarn.

```bash
yarn add @trevoreyre/autocomplete-js
```

You can also use the browser bundle in a script tag.

```html
<script src="https://unpkg.com/@trevoreyre/autocomplete-js"></script>
```

## Usage

The JavaScript component expects a fairly simple HTML structure consisting of a root container element, with an `input` and `ul` children.

```html
<div id="autocomplete" class="autocomplete">
  <input class="autocomplete-input">
  <ul class="autocomplete-results"></ul>
</div>
```

The `Autocomplete` constructor takes two arguments, the `root`, and an `options` object.

```js
new Autocomplete('#autocomplete', options)
```

Upon initialization, the component will take care of initializing all of the proper ARIA attributes. See the example below.

<iframe height="496" style="width: 100%;" scrolling="no" title="Basic Autocomplete" src="//codepen.io/trevoreyre/embed/NoBKKp/?height=496&theme-id=36113&default-tab=html,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/trevoreyre/pen/NoBKKp/'>Basic Autocomplete</a> by Trevor Eyre
  (<a href='https://codepen.io/trevoreyre'>@trevoreyre</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Arguments

| Argument | Type | Description |
| :--- | :--- | :--- |
| `root` | String \| DOM Element (required) | Either the container DOM element, or a selector for it |
| `options` | Object | An object of options to pass to the component. See below for more details. |

#### root

The `root` argument can be either a reference to the container DOM element, or a selector for it.

```js
// root can be a DOM element
const root = document.getElementById('autocomplete')
new Autocomplete(root, options)

// or a string selector
new Autocomplete('#autocomplete', options)
```

Note that if using a selector, it's expected that the selector only matches one DOM element. In the case of a selector that matches multiple elements, the autocomplete component is only attached to the first match. If you need to attach to multiple elements, you will need to loop through them manually. See example below.

<iframe height="496" style="width: 100%;" scrolling="no" title="Multiple autocomplete components" src="//codepen.io/trevoreyre/embed/dajwvK/?height=496&theme-id=36113&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/trevoreyre/pen/dajwvK/'>Multiple autocomplete components</a> by Trevor Eyre
  (<a href='https://codepen.io/trevoreyre'>@trevoreyre</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| [`search`](#search) | Function (required) | | The search funtion to be executed on user input. Can be a synchronous function or a `Promise`. |
| [`onSubmit`](#onSubmit) | Function | | Executed on input submission |
| [`baseClass`](#baseClass) | String | `'autocomplete'` | Base class used to create classes and IDs for generated DOM elements |
| [`autoSelect`](#autoSelect) | Boolean | `false` | Controls whether first result should be highlighted after input |
| [`getResultValue`](#getResultValue) | Function | | For complex search results, this function is executed to get the value to display in the input |
| [`renderResults`](#renderResults) | Function | | Override default rendering of results list |

#### search

The `search` function is executed on user input. It is expected to return either an array of results to be rendered, or a `Promise` that resolves to an array of results.

In the simplest case, `search` can return an array of strings.

<iframe height="496" style="width: 100%;" scrolling="no" title="Basic Autocomplete" src="//codepen.io/trevoreyre/embed/NoBKKp/?height=496&theme-id=36113&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/trevoreyre/pen/NoBKKp/'>Basic Autocomplete</a> by Trevor Eyre
  (<a href='https://codepen.io/trevoreyre'>@trevoreyre</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The `search` function can also return a `Promise`, to make asynchronous calls to an API, for example. The return value doesn't have to be an array of strings, it can also be an array of objects. In this case, you will need to provide a `getResultValue` function to get the raw value from your result object to display in the `input` field when a user selects or submits a result.

Below is a more advanced search example showing these options.

<iframe height="496" style="width: 100%;" scrolling="no" title="Asynchronous autocomplete search" src="//codepen.io/trevoreyre/embed/RvBvRN/?height=496&theme-id=36113&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/trevoreyre/pen/RvBvRN/'>Asynchronous autocomplete search</a> by Trevor Eyre
  (<a href='https://codepen.io/trevoreyre'>@trevoreyre</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

#### onSubmit

The `onSubmit` function is executed when the user submits their result by either selecting a result from the list, or pressing `enter/return`. The function receives the selected result as an argument.

<iframe height="496" style="width: 100%;" scrolling="no" title="Autocomplete onSubmit" src="//codepen.io/trevoreyre/embed/MLBNBp/?height=496&theme-id=36113&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/trevoreyre/pen/MLBNBp/'>Autocomplete onSubmit</a> by Trevor Eyre
  (<a href='https://codepen.io/trevoreyre'>@trevoreyre</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

#### baseClass

The `baseClass` option is used to derive classes for generated DOM elements in the results list. It's also used to create IDs when necessary for use in ARIA attributes.

For example, if you passed a `baseClass` of `'search'`:

```js
new Autocomplete('.search', { baseClass: 'search' })
```

You would get the following DOM (simplified for demonstration purposes):

```html
<!-- The root, input, and ul element classes are unaffected by the baseClass option.
   - It's expected that you provide these classes in your HTML. The baseClass is used
   - to generate an ID for the ul element only if you didn't provide one.
   -->
<div class="search">
  <input class="search-input">
  <ul id="search-results-1" class="search-results">
    <!-- The ID and class for result list items are generated from the baseClass option -->
    <li id="search-result-0" class="search-result">
      First result
    </li>
    <li id="search-result-1" class="search-result">
      Second result
    </li>
  </ul>
```

This option can be useful if you need a certain class in your DOM for styling purposes. See the section on [Styling and customization](#styling-and-customization) for more info.

#### autoSelect

If the `autoSelect` option is set to `true`, the first result in the list will automatically be highlighted after user input.

<iframe height="496" style="width: 100%;" scrolling="no" title="Autocomplete autoSelect" src="//codepen.io/trevoreyre/embed/XOPrjB/?height=496&theme-id=36113&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/trevoreyre/pen/XOPrjB/'>Autocomplete autoSelect</a> by Trevor Eyre
  (<a href='https://codepen.io/trevoreyre'>@trevoreyre</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

#### getResultValue

If your search function returns more complex results like an array of objects, you can use the `getResultValue` function to tell the autocomplete component what value to display in the results list and input. The function receives a result as an argument, and is expected to return a `String` to display for that result.

<iframe height="496" style="width: 100%;" scrolling="no" title="Autocomplete getResultValue" src="//codepen.io/trevoreyre/embed/RvYwVZ/?height=496&theme-id=36113&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/trevoreyre/pen/RvYwVZ/'>Autocomplete getResultValue</a> by Trevor Eyre
  (<a href='https://codepen.io/trevoreyre'>@trevoreyre</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

#### renderResults

You can use the `renderResults` function to take full control of the rendering of your results list. This function takes the following arguments:

- `results` - A list of results
- `resultProps` - A list of props for each result. Each prop item is an `String` of HTML attributes.

The function should return an HTML string to be written to the DOM.

## Styling and customization
