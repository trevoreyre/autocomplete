import AutocompleteJs from '../src/js'
import AutocompleteVue from '../src/vue'
import '../src/styles.css'
import data from './data'

const search = input => {
  if (input.length < 1) {
    return []
  }
  return data.filter(item => item.toLowerCase().startsWith(input.toLowerCase()))
}

const handleSubmit = value => {
  console.log('handleSubmit', value)
}

new AutocompleteJs({
  root: document.querySelector('.autocomplete'),
  input: document.querySelector('.autocomplete-input'),
  results: document.querySelector('.autocomplete-results'),
  searchFn: search,
  shouldAutoSelect: true,
  onSubmit: handleSubmit
})

new Vue({
  el: '#app',
  components: {
    autocomplete: AutocompleteVue
  },
  data() {
    return {
      search,
      handleSubmit
    }
  }
})
