<template>
  <div ref="root" :class="baseClass">
    <input
      ref="input"
      v-model="value"
      :class="inputClass"
      role="combobox"
      autocomplete="off"
      autocapitalize="off"
      autocorrect="off"
      spellcheck="false"
      aria-autocomplete="list"
      aria-haspopup="listbox"
      :aria-owns="resultsId"
      v-bind="{ ...inputProps, ...$attrs }"
      @input="handleInput"
      @keydown="handleKeydown"
    />
    <ul
      :id="resultsId"
      ref="results"
      :class="resultsClass"
      role="listbox"
      @click="handleResultClick"
    >
      <slot :results="results" :resultProps="resultProps">
        <li
          v-for="(result, index) in results"
          :key="resultProps[index].id"
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
import uniqueId from '../autocomplete/util/uniqueId.js'

export default {
  name: 'Autocomplete',
  inheritAttrs: false,

  props: {
    baseClass: {
      type: String,
      default: 'autocomplete',
    },
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
    return {
      autocomplete: new AutocompleteCore({
        search: this.search,
        autoSelect: this.autoSelect,
        setValue: this.setValue,
        onUpdate: this.handleUpdate,
        onSubmit: this.onSubmit,
        onShow: this.handleShow,
        onHide: this.handleHide,
      }),
      value: this.defaultValue,
      resultsId: uniqueId(`${this.baseClass}-results-`),
      results: [],
      selectedIndex: -1,
      resetResultsPosition: true,
    }
  },

  computed: {
    resultsClass() {
      return `${this.baseClass}-results`
    },
    resultProps() {
      return this.results.map((result, index) => ({
        id: `${this.baseClass}-result-${index}`,
        class: `${this.baseClass}-result`,
        'data-result-index': index,
        role: 'option',
        ...(this.selectedIndex === index ? { 'aria-selected': 'true' } : {}),
      }))
    },
    inputClass() {
      return `${this.baseClass}-input`
    },
    inputProps() {
      return {
        'aria-expanded': this.results.length ? 'true' : 'false',
        'aria-activedescendant':
          this.selectedIndex > -1
            ? this.resultProps[this.selectedIndex].id
            : '',
      }
    },
  },

  mounted() {
    this.$refs.results.style.position = 'fixed'
    this.$refs.results.style.zIndex = '1'
    this.handleHide()
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
    let resetYPosition = 'bottom'
    if (inputPosition.bottom + resultsPosition.height > window.innerHeight) {
      yPosition = {
        key: 'bottom',
        value: window.innerHeight - inputPosition.top + 'px',
      }
      resetYPosition = 'top'
    }
    this.$refs.results.style[resetYPosition] = null
    this.$refs.results.style[yPosition.key] = yPosition.value
    this.$refs.results.style.left = inputPosition.left + 'px'
    this.$refs.results.style.width = inputPosition.width + 'px'
  },

  methods: {
    setValue(result) {
      this.value = result ? this.getResultValue(result) : ''
    },

    handleUpdate(results, selectedIndex) {
      this.results = results
      this.selectedIndex = selectedIndex
    },

    handleShow() {
      this.$refs.results.style.visibility = 'visible'
      this.$refs.results.style.pointerEvents = 'auto'
    },

    handleHide() {
      this.$refs.results.style.visibility = 'hidden'
      this.$refs.results.style.pointerEvents = 'none'
      this.resetResultsPosition = true
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
