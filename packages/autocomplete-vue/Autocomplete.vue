<template>
  <div ref="root" class="autocomplete">
    <input
      ref="input"
      v-model="value"
      role="combobox"
      autocomplete="off"
      spellcheck="false"
      aria-autocomplete="list"
      aria-owns="autocomplete-results"
      aria-haspopup="listbox"
      v-bind="{ ...$attrs, ...attributes }"
      @input="handleInput"
      @keydown="handleKeydown"
    />
    <ul
      id="autocomplete-results"
      ref="results"
      class="autocomplete-results"
      role="listbox"
      @click="handleResultClick"
    >
      <slot :results="results" :resultProps="resultProps">
        <li
          v-for="(result, index) in results"
          :id="'autocomplete-result-' + index"
          :key="'autocomplete-result-' + index"
          v-bind="resultProps[index]"
        >
          {{ getResultValue(result) }}
        </li>
      </slot>
    </ul>
  </div>
</template>

<script>
import AutocompleteCore from '../autocomplete/AutocompleteCore.js'

export default {
  name: 'Autocomplete',
  inheritAttrs: false,
  props: {
    search: {
      type: Function,
      required: true,
    },
    autoSelect: {
      type: Boolean,
      default: false,
    },
    onSubmit: {
      type: Function,
      default: () => {},
    },
    getResultValue: {
      type: Function,
      default: result => result,
    },
    defaultValue: {
      type: String,
      default: '',
    },
  },
  data() {
    const data = {
      autocomplete: new AutocompleteCore({
        search: this.search,
        autoSelect: this.autoSelect,
        setValue: this.setValue,
        setAttribute: this.setAttribute,
        onUpdateResults: this.handleUpdateResults,
        onSubmit: this.onSubmit,
      }),
      attributes: {
        'aria-expanded': 'false',
      },
      value: this.defaultValue,
      results: [],
      resultProps: [],
      selectedIndex: 0,
    }
    return data
  },
  mounted() {
    document.body.addEventListener('click', this.handleDocumentClick)
  },
  beforeDestroy() {
    document.body.removeEventListener('click', this.handleDocumentClick)
  },
  updated() {
    const inputPosition = this.$refs.input.getBoundingClientRect()
    const resultsPosition = this.$refs.results.getBoundingClientRect()

    // Place results below input, unless there isn't enough room
    let yPosition = `top: ${inputPosition.bottom}px`
    if (inputPosition.bottom + resultsPosition.height > window.innerHeight) {
      yPosition = `bottom: ${window.innerHeight - inputPosition.top}px`
    }
    this.$refs.results.style = `${yPosition}; left: ${inputPosition.left}px; width: ${inputPosition.width}px`
  },
  methods: {
    setValue(result) {
      this.value = result ? this.getResultValue(result) : ''
    },
    setAttribute(attribute, value) {
      this.attributes[attribute] = value
    },
    handleUpdateResults(results, selectedIndex) {
      this.results = results
      this.resultProps = results.map((result, index) => ({
        class: 'autocomplete-result',
        role: 'option',
        ...(selectedIndex === index ? { 'aria-selected': 'true' } : {}),
      }))
      this.selectedIndex = selectedIndex
    },
    handleInput(event) {
      this.value = event.target.value
      this.autocomplete.handleInput(event)
    },
    handleKeydown(event) {
      this.autocomplete.handleKeydown(event)
    },
    handleResultClick(event) {
      this.autocomplete.handleResultClick(event)
    },
    handleDocumentClick(event) {
      if (this.$refs.root.contains(event.target)) {
        return
      }
      this.autocomplete.hideResults()
    },
  },
}
</script>
