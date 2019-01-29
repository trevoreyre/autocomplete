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
        onUpdate: this.handleUpdate,
        onSubmit: this.onSubmit,
        onShow: this.handleShow,
        onHide: this.handleHide,
      }),
      attributes: {
        'aria-expanded': 'false',
      },
      value: this.defaultValue,
      results: [],
      resultProps: [],
      selectedIndex: 0,
      resetResultsPosition: true,
    }
    return data
  },
  mounted() {
    this.$refs.results.style.position = 'fixed'
    this.$refs.results.style.zIndex = '1'
    document.body.addEventListener('click', this.handleDocumentClick)
  },
  beforeDestroy() {
    document.body.removeEventListener('click', this.handleDocumentClick)
  },
  updated() {
    // Prevent results from flipping from above input to below while open
    if (!this.resetResultsPosition || this.results.length === 0) {
      return
    }
    this.resetResultsPosition = false

    const inputPosition = this.$refs.input.getBoundingClientRect()
    const resultsPosition = this.$refs.results.getBoundingClientRect()

    // Place results below input, unless there isn't enough room
    let yPosition = { key: 'top', value: inputPosition.bottom + 'px' }
    if (inputPosition.bottom + resultsPosition.height > window.innerHeight) {
      yPosition = {
        key: 'bottom',
        value: window.innerHeight - inputPosition.top + 'px',
      }
    }
    this.$refs.results.style[yPosition.key] = yPosition.value
    this.$refs.results.style.left = inputPosition.left + 'px'
    this.$refs.results.style.width = inputPosition.width + 'px'
  },
  methods: {
    setValue(result) {
      this.value = result ? this.getResultValue(result) : ''
    },
    setAttribute(attribute, value) {
      this.attributes[attribute] = value
    },
    handleUpdate(results, selectedIndex) {
      this.results = results
      this.resultProps = results.map((result, index) => ({
        class: 'autocomplete-result',
        role: 'option',
        ...(selectedIndex === index ? { 'aria-selected': 'true' } : {}),
      }))
      this.selectedIndex = selectedIndex

      if (this.results.length === 0) {
        this.resetResultsPosition = true
      }
    },
    handleShow() {
      this.$refs.results.style.visibility = 'visible'
      this.$refs.results.style.pointerEvents = 'auto'
    },
    handleHide() {
      this.$refs.results.style.visibility = 'hidden'
      this.$refs.results.style.pointerEvents = 'none'
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
