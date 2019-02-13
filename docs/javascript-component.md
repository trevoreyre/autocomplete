# JavaScript component

## Installation

Install the component from `npm`.

```bash
npm install --save @trevoreyre/autocomplete-js
```

Or using `yarn`.

```bash
yarn add @trevoreyre/autocomplete-js
```

You can also use the browser bundle in a script tag.

```html
<script src="https://unpkg.com/@trevoreyre/autocomplete-js"></script>
```

## Usage

The JavaScript component expects a fairly simple HTML structure consisting of a root container element, with an `<input>` and `<ul>` children.

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

The `root` can be either a reference to the container element, or a selector for it. Upon initialization, the component will take care of initializing all of the proper ARIA attributes. See the example below.

<iframe height="496" style="width: 100%;" scrolling="no" title="Basic Autocomplete" src="//codepen.io/trevoreyre/embed/NoBKKp/?height=496&theme-id=36113&default-tab=html,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/trevoreyre/pen/NoBKKp/'>Basic Autocomplete</a> by Trevor Eyre
  (<a href='https://codepen.io/trevoreyre'>@trevoreyre</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Arguments

| Argument | Type | Description |
| :--- | :--- | :--- |
| `root` | String \| DOM Element (required) | Either the root/container element, or a selector for it |
| `options` | Object | An object of options to pass to the component. See below for more details. |

#### root

The `root` argument can be either a reference to a DOM element, or a selector for the root element.

```js
// root can be a DOM element
const root = document.getElementById('autocomplete')
new Autocomplete(root, options)

// or a string selector
new Autocomplete('#autocomplete', options)
```

Note that if using a selector, it's expected that the selector only matches one DOM element. In the case of a selector that matches multiple elements, the autocomplete component is only attached to the first match.

## Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `search` | Function (required) | | The search funtion to be executed on user input. Can be a synchronous function or a Promise. |
| `onSubmit` | Function | | Executed on input submission |
| `baseClass` | String | `'autocomplete'` | Base class used to create classes and IDs for generated DOM nodes |
| `autoSelect` | Boolean | `false` | Controls whether first result should be highlighted after input |
| `getResultValue` | Function | | For complex search results, this function is executed to get the value to display in the input |
| `renderResults` | Function | | Override default rendering of results list |

#### search

The `search` function is executed on any user input. It is expected to return either an array of results to be rendered, or a `Promise` that resolves to an array of results.
