<template>
  <div ref="root">
    <slot
      :rootProps="rootProps"
      :inputProps="inputProps"
      :inputListeners="inputListeners"
      :resultListProps="resultListProps"
      :resultListListeners="resultListListeners"
      :results="results"
      :resultProps="resultProps"
    >
      <div v-bind="rootProps">
        <input
          ref="input"
          v-bind="{ ...inputProps, ...$attrs }"
          v-on="{ ...inputListeners, ...$listeners }"
        />
        <ul
          ref="resultList"
          v-bind="resultListProps"
          v-on="resultListListeners"
        >
          <slot name="results" :results="results" :resultProps="resultProps">
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
    </slot>
  </div>
</template>

<script>
import AutocompleteCore from '../autocomplete/AutocompleteCore.js'
import uniqueId from '../autocomplete/util/uniqueId.js'
import getRelativePosition from '../autocomplete/util/getRelativePosition.js'

export default {
  name: 'Autocomplete',
  inheritAttrs: false,

  props: {
    search: {
      type: Function,
      required: true,
    },
    classPrefix: {
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
      core: new AutocompleteCore({
        search: this.search,
        autoSelect: this.autoSelect,
        setValue: this.setValue,
        onUpdate: this.handleUpdate,
        onSubmit: this.handleSubmit,
        onShow: this.handleShow,
        onHide: this.handleHide,
        onLoading: this.handleLoading,
        onLoaded: this.handleLoaded,
      }),
      value: this.defaultValue,
      resultListId: uniqueId(`${this.classPrefix}-results-`),
      results: [],
      selectedIndex: -1,
      expanded: false,
      loading: false,
      position: 'below',
      resetPosition: true,
    }
  },

  computed: {
    rootProps() {
      return {
        class: this.classPrefix,
        style: { position: 'relative' },
        'data-expanded': this.expanded,
        'data-loading': this.loading,
        'data-position': this.position,
      }
    },
    inputProps() {
      return {
        class: `${this.classPrefix}-input`,
        value: this.value,
        role: 'combobox',
        autocomplete: 'off',
        autocapitalize: 'off',
        autocorrect: 'off',
        spellcheck: 'false',
        'aria-autocomplete': 'list',
        'aria-haspopup': 'listbox',
        'aria-owns': this.resultListId,
        'aria-expanded': this.expanded ? 'true' : 'false',
        'aria-activedescendant':
          this.selectedIndex > -1
            ? this.resultProps[this.selectedIndex].id
            : '',
      }
    },
    inputListeners() {
      return {
        input: this.handleInput,
        keydown: this.core.handleKeyDown,
        focus: this.core.handleFocus,
        blur: this.core.handleBlur,
      }
    },
    resultListProps() {
      const yPosition = this.position === 'below' ? 'top' : 'bottom'
      return {
        id: this.resultListId,
        class: `${this.classPrefix}-result-list`,
        role: 'listbox',
        style: {
          position: 'absolute',
          zIndex: 1,
          width: '100%',
          visibility: this.expanded ? 'visible' : 'hidden',
          pointerEvents: this.expanded ? 'auto' : 'none',
          [yPosition]: '100%',
        },
      }
    },
    resultListListeners() {
      return {
        mousedown: this.core.handleResultMouseDown,
        click: this.core.handleResultClick,
      }
    },
    resultProps() {
      return this.results.map((result, index) => ({
        id: `${this.classPrefix}-result-${index}`,
        class: `${this.classPrefix}-result`,
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
    if (!this.$refs.input || !this.$refs.results) {
      return
    }
    if (this.resetPosition && this.results.length > 0) {
      this.resetPosition = false
      this.position = getRelativePosition(this.$refs.input, this.$refs.results)
    }
    this.core.checkSelectedResultVisible(this.$refs.results)
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
      this.core.handleInput(event)
    },

    handleSubmit(selectedResult) {
      this.$emit('submit', selectedResult)
    },

    handleDocumentClick(event) {
      if (this.$refs.root.contains(event.target)) {
        return
      }
      this.core.hideResults()
    },
  },
}
</script>
