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

To add the default styling for the component, include the CSS file on your page as well.

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@trevoreyre/autocomplete-js/dist/style.css"
/>
```

## Usage

The JavaScript component expects a fairly simple HTML structure consisting of a root container element, with an `input` and `ul` children.

```html
<div id="autocomplete" class="autocomplete">
  <input class="autocomplete-input" />
  <ul class="autocomplete-result-list"></ul>
</div>
```

The constructor takes two arguments, the `root`, and an `options` object.

```js
new Autocomplete('#autocomplete', options)
```

Upon initialization, the component will take care of initializing all of the proper ARIA attributes. See the example below.

<iframe height="496" scrolling="no" title="Simple autocomplete - @trevoreyre/autocomplete-js" src="//codepen.io/trevoreyre/embed/NoBKKp/?height=496&theme-id=36113&default-tab=html,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/trevoreyre/pen/NoBKKp/'>Simple autocomplete - @trevoreyre/autocomplete-js</a> by Trevor Eyre
  (<a href='https://codepen.io/trevoreyre'>@trevoreyre</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Arguments

| Argument  | Type                             | Description                                                                |
| :-------- | :------------------------------- | :------------------------------------------------------------------------- |
| `root`    | String \| DOM Element (required) | Either the container DOM element, or a selector for it                     |
| `options` | Object                           | An object of options to pass to the component. See below for more details. |

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

<iframe height="496" scrolling="no" title="Multiple autocomplete components - @trevoreyre/autocomplete-js" src="//codepen.io/trevoreyre/embed/dajwvK/?height=496&theme-id=36113&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/trevoreyre/pen/dajwvK/'>Multiple autocomplete components - @trevoreyre/autocomplete-js</a> by Trevor Eyre
  (<a href='https://codepen.io/trevoreyre'>@trevoreyre</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Options

| Option                              | Type                | Default          | Description                                                                                             |
| :---------------------------------- | :------------------ | :--------------- | :------------------------------------------------------------------------------------------------------ |
| [`search`](#search)                 | Function (required) |                  | The search function to be executed on user input. Can be a synchronous function or a `Promise`.         |
| [`onSubmit`](#onsubmit)             | Function            |                  | Executed on input submission                                                                            |
| [`baseClass`](#baseclass)           | String              | `'autocomplete'` | Base class used to create classes and IDs for generated DOM elements                                    |
| [`autoSelect`](#autoselect)         | Boolean             | `false`          | Controls whether first result should be highlighted after input                                         |
| [`getResultValue`](#getresultvalue) | Function            |                  | For complex search results, this function is executed to get the value to display in the input          |
| [`debounceTime`](#debouncetime)     | Number              | `0`              | Time in milliseconds that the component should wait after last keystroke before calling search function |
| [`renderResult`](#renderresult)     | Function            |                  | Override default rendering of result items                                                              |

#### search

The `search` function is executed on user input. It is expected to return either an array of results to be rendered, or a `Promise` that resolves to an array of results.

In the simplest case, `search` can return an array of strings.

<iframe height="496" scrolling="no" title="Simple autocomplete - @trevoreyre/autocomplete-js" src="//codepen.io/trevoreyre/embed/NoBKKp/?height=496&theme-id=36113&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/trevoreyre/pen/NoBKKp/'>Simple autocomplete - @trevoreyre/autocomplete-js</a> by Trevor Eyre
  (<a href='https://codepen.io/trevoreyre'>@trevoreyre</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The `search` function can also return a `Promise`, to make asynchronous calls to an API, for example. The return value doesn't have to be an array of strings, it can also be an array of objects. In this case, you will need to provide a `getResultValue` function to get the raw value from your result object to display in the `input` field when a user selects or submits a result.

Below is a more advanced search example showing these options.

<iframe height="496" scrolling="no" title="Advanced autocomplete search - @trevoreyre/autocomplete-js" src="//codepen.io/trevoreyre/embed/RvBvRN/?height=496&theme-id=36113&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/trevoreyre/pen/RvBvRN/'>Advanced autocomplete search - @trevoreyre/autocomplete-js</a> by Trevor Eyre
  (<a href='https://codepen.io/trevoreyre'>@trevoreyre</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

#### onSubmit

The `onSubmit` function is executed when the user submits their result by either selecting a result from the list, or pressing `enter/return`. The function receives the selected result as an argument.

<iframe height="496" scrolling="no" title="Autocomplete onSubmit option - @trevoreyre/autocomplete-js" src="//codepen.io/trevoreyre/embed/MLBNBp/?height=496&theme-id=36113&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/trevoreyre/pen/MLBNBp/'>Autocomplete onSubmit option - @trevoreyre/autocomplete-js</a> by Trevor Eyre
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
  <input class="search-input" />
  <ul id="search-result-list-1" class="search-result-list">
    <!-- The ID and class for result list items are generated from the baseClass option -->
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

<iframe height="496" scrolling="no" title="Autocomplete autoSelect option - @trevoreyre/autocomplete-js" src="//codepen.io/trevoreyre/embed/XOPrjB/?height=496&theme-id=36113&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/trevoreyre/pen/XOPrjB/'>Autocomplete autoSelect option - @trevoreyre/autocomplete-js</a> by Trevor Eyre
  (<a href='https://codepen.io/trevoreyre'>@trevoreyre</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

#### getResultValue

If your search function returns more complex results like an array of objects, you can use the `getResultValue` function to tell the autocomplete component what value to display in the results list and input. The function receives a result as an argument, and is expected to return a `String` to display for that result.

<iframe height="496" scrolling="no" title="Autocomplete getResultValue option - @trevoreyre/autocomplete-js" src="//codepen.io/trevoreyre/embed/RvYwVZ/?height=496&theme-id=36113&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/trevoreyre/pen/RvYwVZ/'>Autocomplete getResultValue option - @trevoreyre/autocomplete-js</a> by Trevor Eyre
  (<a href='https://codepen.io/trevoreyre'>@trevoreyre</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

#### debounceTime

The `debounceTime` option can be used to improve the performance of your UI by specifying an amount of time (milliseconds) to wait before invoking the search function. This ensures that the search function will not fire until the user is done typing instead of firing after each keystroke.

<iframe height="496" scrolling="no" title="Autocomplete debounceTime prop - @trevoreyre/autocomplete-js" src="https://codepen.io/trevoreyre/embed/WNbJvmP?height=300&theme-id=36113&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/trevoreyre/pen/WNbJvmP'>Autocomplete debounceTime prop - @trevoreyre/autocomplete-js</a> by Trevor Eyre
  (<a href='https://codepen.io/trevoreyre'>@trevoreyre</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

#### renderResult

You can use the `renderResult` function to override the default rendering of items in your result list. This function takes the following arguments:

- `result` - The result value returned from your `search` function
- `props` - An object containing generated attributes for the result item, which are expected to be set on your `li` element. The object has a custom `toString` function which lets you easily serialize it to a `String` of HTML attributes in the form `attribute1="value1" attribute2="value2"`. This way, you don't have to worry about generating the proper IDs, classes, and ARIA attributes yourself.

The `renderResult` function should return either a DOM element or an HTML string.

<iframe height="496" scrolling="no" title="Autocomplete renderResults option - @trevoreyre/autocomplete-js" src="//codepen.io/trevoreyre/embed/vbzzEd/?height=496&theme-id=36113&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/trevoreyre/pen/vbzzEd/'>Autocomplete renderResults option - @trevoreyre/autocomplete-js</a> by Trevor Eyre
  (<a href='https://codepen.io/trevoreyre'>@trevoreyre</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Styling and customization

To include the default styling of the autocomplete component that you see here in the docs, include the CSS file on your page.

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@trevoreyre/autocomplete-js/dist/style.css"
/>
```

This styling is intentionally opinionated, however, it's relatively easy to write your own CSS if you want a different style. All positional styling is handled inline, so you don't have to worry about positioning the results list in your CSS. Below is an example of what the component looks like completely unstyled.

<iframe height="496" scrolling="no" title="Unstyled autocomplete - @trevoreyre/autocomplete-js" src="//codepen.io/trevoreyre/embed/gqBQGm/?height=496&theme-id=36113&default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/trevoreyre/pen/gqBQGm/'>Unstyled autocomplete - @trevoreyre/autocomplete-js</a> by Trevor Eyre
  (<a href='https://codepen.io/trevoreyre'>@trevoreyre</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

You can provide the IDs and classes for the root element, `input`, and `ul` elements yourself in your HTML template. IDs and classes for the `li` elements are generated for you, but can be customized using the [`baseClass`](#baseclass) option. If you need more control than the `baseClass` option can provide, you can also take full control of the rendering of items in your results list using the [`renderResult`](#renderresult) option.

Below is an example of a typical DOM structure, and all the properties that might be relevant for styling.

```html
<div
  id="autocomplete"
  class="autocomplete"
  data-expanded="true"
  data-loading="false"
  data-position="below"
>
  <input class="autocomplete-input" aria-expanded="true" />
  <ul id="autocomplete-result-list-1" class="autocomplete-result-list">
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
[data-position='above'] .autocomplete-result-list {
  border-bottom: none;
  border-radius: 8px 8px 0 0;
}
```
