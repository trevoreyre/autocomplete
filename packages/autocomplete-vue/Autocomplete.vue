<template>
  <div class="autocomplete-container">
    <div
      class="autocomplete"
      ref="root"
      role="combobox"
      aria-owns="autocomplete-results"
      aria-haspopup="listbox"
      v-bind="rootAttributes"
    >
      <input
        class="autocomplete-input"
        ref="input"
        placeholder="Search for a fruit or vegetable"
        aria-label="Search for a fruit or vegetable"
        aria-autocomplete="list"
        aria-controls="autocomplete-results"
        :value="value"
        v-bind="inputAttributes"
        @input="handleInput"
        @keydown="handleKeydown"
      >
      <button type="submit" class="autocomplete-submit">
        <svg viewBox="0 0 24 24">
          <path
            d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
          ></path>
        </svg>
      </button>
    </div>
    <ul
      id="autocomplete-results"
      class="autocomplete-results"
      role="listbox"
      aria-label="Search for a fruit or vegetable"
      @click="handleResultClick"
    >
      <li
        v-for="(result, index) in results"
        :key="'autocomplete-result' + index"
        :id="'autocomplete-result-' + index"
        class="autocomplete-result"
        role="option"
        :aria-selected="selectedIndex === index ? 'true' : 'false'"
      >{{ result }}</li>
    </ul>
  </div>
</template>

<script>
import AutocompleteCore from "../autocomplete/AutocompleteCore.js";

export default {
  name: "autocomplete",
  props: {
    searchFn: {
      type: Function,
      required: true
    },
    shouldAutoSelect: {
      type: Boolean,
      default: false
    },
    onSubmit: {
      type: Function
    },
    defaultValue: {
      type: String,
      default: ""
    }
  },
  data() {
    const data = {
      autocomplete: new AutocompleteCore({
        searchFn: this.searchFn,
        shouldAutoSelect: this.shouldAutoSelect,
        setValue: this.setValue,
        setAttribute: this.setAttribute,
        setInputAttribute: this.setInputAttribute,
        setSelectionRange: this.setSelectionRange,
        onUpdateResults: this.handleUpdateResults,
        onSubmit: this.onSubmit
      }),
      rootAttributes: {
        "aria-expanded": "false"
      },
      inputAttributes: {},
      value: this.defaultValue,
      results: [],
      selectedIndex: 0
    };
    return data;
  },
  created() {
    document.body.addEventListener("click", this.handleDocumentClick);
  },
  methods: {
    setValue(value) {
      this.value = value;
    },
    setAttribute(attribute, value) {
      this.rootAttributes[attribute] = value;
    },
    setInputAttribute(attribute, value) {
      this.inputAttributes[attribute] = value;
    },
    handleUpdateResults(results, selectedIndex) {
      this.results = results;
      this.selectedIndex = selectedIndex;
    },
    handleInput(event) {
      this.value = event.target.value;
      this.autocomplete.handleInput(event);
    },
    handleKeydown(event) {
      this.autocomplete.handleKeydown(event);
    },
    handleResultClick(event) {
      this.autocomplete.handleResultClick(event);
    },
    handleDocumentClick(event) {
      if (this.$refs.root.contains(event.target)) {
        return;
      }
      this.autocomplete.hideResults();
    }
  }
};
</script>
