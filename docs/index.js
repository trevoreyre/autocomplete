/* global Vue */
import AutocompleteJs from '../packages/autocomplete-js'
import AutocompleteVue from '../packages/autocomplete-vue'
import '../packages/autocomplete/autocomplete.css'
import data from './data'

const search = input => {
  if (input.length < 1) {
    return []
  }
  return data.filter(item => item.toLowerCase().startsWith(input.toLowerCase()))
}

const handleSubmit = value => {
  console.log('handleSubmit', value) // eslint-disable-line
}

new AutocompleteJs({
  root: document.querySelector('.autocomplete'),
  input: document.querySelector('.autocomplete-input'),
  results: document.querySelector('.autocomplete-results'),
  search: search,
  autoSelect: true,
  onSubmit: handleSubmit,
})

new Vue({
  el: '#app',
  components: {
    autocomplete: AutocompleteVue,
  },
  data() {
    return {
      search,
      handleSubmit,
    }
  },
})
