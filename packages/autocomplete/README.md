# @trevoreyre/autocomplete

The core package provides the base functionality of the autocomplete component. It provides an instance to track the current state, and event handlers to respond to user input. It doesn't actually render anything to the DOM, so that it can remain flexible and be used in multiple platforms.

The best way to learn how to use the core package is to take a look at the source code of other components that provide a rendering layer on top of it, like the [JavaScript component][javascript-component] and the [Vue component][vue-component]

## Demo

Take a look at the [documentation page](https://autocomplete.trevoreyre.com), and the [Codepen examples](https://codepen.io/collection/DrwmoR/).

## Installation

Install the component from npm.

```bash
npm install --save @trevoreyre/autocomplete
```

Or using yarn.

```bash
yarn add @trevoreyre/autocomplete
```

You can also use the browser bundle in a script tag.

```html
<script src="https://unpkg.com/@trevoreyre/autocomplete"></script>
```

## Usage

The core package provides a class instance to handle the internal state of the autocomplete component. The component can be tweaked using a number of constructor arguments.

```js
const autocomplete = new Autocomplete(options)
```

## Arguments

| Argument        | Type                | Description                                                                                                    |
| :-------------- | :------------------ | :------------------------------------------------------------------------------------------------------------- |
| `search`        | Function (required) | The search function to be executed on user input. Can be a synchronous function or a `Promise`.                |
| `autoSelect`    | Boolean             | Controls whether first result should be highlighted after input                                                |
| `setValue`      | Function            | Sets the value of the calling component's `input` element                                                      |
| `setAttribute`  | Function            | Sets attributes on the calling component's `input` element                                                     |
| `onUpdate`      | Function            | Fired when the results list is updated. Receives `results` (Array), and `selectedIndex` (Number) as arguments. |
| `onSubmit`      | Function            | Fired when user submits result. Receives `result` as argument.                                                 |
| `onShow`        | Function            | Fired when the results list is shown                                                                           |
| `onHide`        | Function            | Fired when the results list is hidden                                                                          |
| `onLoading`     | Function            | Fired if `search` is a `Promise` and hasn't resolved yet                                                       |
| `onLoaded`      | Function            | Fired after asynchronous `search` function resolves                                                            |
| `submitOnEnter` | Boolean             | If `true`, immediately call `onSubmit` on result when pressing <kbd>Enter</kbd>. Default: `true`               |

## Event handlers

The core package provides a number of event handlers that can be wired up in the calling component.

| Name                    | Description                                   |
| :---------------------- | :-------------------------------------------- |
| `handleInput`           | Handles the `input` element's `input` event   |
| `handleKeyDown`         | Handles the `input` element's `keydown` event |
| `handleBlur`            | Handles the `input` element's `blur` event    |
| `handleResultMouseDown` | Handles the `ul` element's `mousedown` event  |
| `handleResultClick`     | Handles the `ul` element's `click` event      |

[javascript-component]: packages/autocomplete-js/Autocomplete.js
[vue-component]: packages/autocomplete-vue/Autocomplete.vue

## Methods

| Name      | Description                                                                            |
|:----------|:---------------------------------------------------------------------------------------|
| `destroy` | Removes all event listeners and object references that were set during initialization. |
