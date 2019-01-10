import Autocomplete from './js'
import AutocompleteVue from './vue'
import data from './data'
import './styles.css'

const search = input => {
  if (input.length < 1) {
    return []
  }
  return data.filter(item => item.toLowerCase().startsWith(input.toLowerCase()))
}

const handleSubmit = value => {
  console.log('handleSubmit', value)
}

new Autocomplete({
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
