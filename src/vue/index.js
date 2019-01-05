import Autocomplete from '../autocomplete'

const VueAutocomplete = {
  name: 'autocomplete',
  template: `
    <div class='autocomplete-container'>
      <div
        class='autocomplete'
        role='combobox'
        aria-owns='autocomplete-results'
        aria-haspopup='listbox'
        :aria-expanded="ariaExpanded"
      >
        <input
          class='autocomplete-input'
          placeholder='Search for a fruit or vegetable'
          aria-label='Search for a fruit or vegetable'
          aria-autocomplete='both'
          aria-controls='autocomplete-results'
          :value='value'
          @keyup='handleKeyup'
          @keydown='handleKeydown'
          @focus='handleFocus'
        >
        <button type='submit' class='autocomplete-submit'>
          <svg viewBox='0 0 24 24'>
            <path d='M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z' />
          </svg>
        </button>
      </div>
      <ul
        id='autocomplete-results'
        class='autocomplete-results'
        role='listbox'
        aria-label='Search for a fruit or vegetable'
        :click='handleResultClick'
      >
        <li v-for='(result, index) in results'
          :id="'autocomplete-result-' + index"
          class='autocomplete-result'
          role='option'
          :aria-selected="activeIndex === index ? 'true' : 'false'"
        >
          {{ result }}
        </li>
      </ul>
    </div>
  `,
  props: [
    'searchFn',
    'shouldAutoselect',
    'onShow',
    'onHide',
    'shouldAutocomplete',
    'defaultValue'
  ],
  data () {
    const data = {
      autocomplete: new Autocomplete({
        setAttribute: this.setRootAttribute,
        getValue: this.getValue,
        setValue: this.setValue,
        setInputAttribute: this.setInputAttribute,
        setSelectionRange: this.setSelectionRange,
        renderResults: this.renderResults,
        searchFn: this.searchFn,
        shouldAutoSelect: this.shouldAutoSelect,
        onShow: this.onShow,
        onHide: this.onHide,
        shouldAutocomplete: this.shouldAutocomplete
      }),
      ariaExpanded: 'false',
      value: this.defaultValue,
      results: []
    }
    console.log('data', data)
    return data
  },
  methods: {
    setRootAttribute (attribute, value) {
      this.ariaExpanded = value
    },
    getValue () {
      return this.value
    },
    setValue (value) {
      this.value = value
    },
    setInputAttribute (attribute, value) { },
    setSelectionRange (start, end) { },
    renderResults (results, activeIndex) {
      console.log('vue renderResults', results, activeIndex)
      this.results = results
      this.activeIndex = activeIndex
    },
    handleKeyup (event) {
      this.autocomplete.handleKeyup(event)
    },
    handleKeydown (event) {
      this.autocomplete.handleKeydown(event)
    },
    handleFocus (event) {
      this.autocomplete.handleFocus(event)
    },
    handleResultClick (event) {
      this.autocomplete.handleResultClick(event)
    }
  }
}

export default VueAutocomplete
