<template>
  <div ref="root" :class="baseClass" style="position: relative" v-bind="rootProps">
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
      :style="resultsStyle"
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
    search: {
      type: Function,
      required: true,
    },
    onSubmit: {
      type: Function,
      default: () => {},
    },
    baseClass: {
      type: String,
      default: 'autocomplete',
    },
    autoSelect: {
      type: Boolean,
      default: false,
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
        onLoading: this.handleLoading,
        onLoaded: this.handleLoaded,
      }),
      value: this.defaultValue,
      resultsId: uniqueId(`${this.baseClass}-results-`),
      results: [],
      selectedIndex: -1,
      expanded: false,
      loading: false,
      position: {},
      resetPosition: true,
    }
  },

  computed: {
    rootProps() {
      return {
        'data-expanded': this.expanded,
        'data-loading': this.loading,
        'data-position': this.position.bottom ? 'above' : 'below',
      }
    },
    inputClass() {
      return `${this.baseClass}-input`
    },
    inputProps() {
      return {
        'aria-expanded': this.expanded ? 'true' : 'false',
        'aria-activedescendant':
          this.selectedIndex > -1
            ? this.resultProps[this.selectedIndex].id
            : '',
      }
    },
    resultsClass() {
      return `${this.baseClass}-results`
    },
    resultsStyle() {
      return {
        position: 'absolute',
        zIndex: 1,
        visibility: this.expanded ? 'visible' : 'hidden',
        pointerEvents: this.expanded ? 'auto' : 'none',
        ...this.position,
      }
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
  },

  mounted() {
    document.body.addEventListener('click', this.handleDocumentClick)
  },

  beforeDestroy() {
    document.body.removeEventListener('click', this.handleDocumentClick)
  },

  updated() {
    if (this.resetPosition && this.results.length > 0) {
      this.resetPosition = false
      this.position = this.autocomplete.getResultsPosition(
        this.$refs.input,
        this.$refs.results
      )
    }
    this.autocomplete.checkSelectedResultVisible(this.$refs.results)
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
      this.expanded = true
    },

    handleHide() {
      this.expanded = false
      this.resetPosition = true
    },

    handleLoading() {
      this.loading = true
    },

    handleLoaded() {
      this.loading = false
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
