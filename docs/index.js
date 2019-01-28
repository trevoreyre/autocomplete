/* global Vue */
import sortBy from 'lodash/sortBy'
import AutocompleteJs from '../packages/autocomplete-js/index.js'
import AutocompleteVue from '../packages/autocomplete-vue/index.js'
import '../packages/autocomplete/autocomplete.css'
import data from './data'

const search = input => {
  if (input.length < 1) {
    return []
  }
  const results = data.filter(item =>
    item.value.toLowerCase().startsWith(input.toLowerCase())
  )
  return sortBy(results, ['type'])
}

const getResultValue = result => result.value

const renderResults = (results, resultProps) => {
  return results
    .map((result, index) => {
      let resultHtml = ''
      if (index === 0 || results[index - 1].type !== result.type) {
        resultHtml += `
          <div style='padding:8px; background:black; color:white;'>
            ${result.type}
          </div>
        `
      }
      resultHtml += `
        <li id='autocomplete-result-${index}' ${resultProps[index]}>
          <a href='#'>
            ${result.value}
          </a>
        </li>
      `
      return resultHtml
    })
    .join('')
}

const handleSubmit = value => {
  console.log('handleSubmit', value) // eslint-disable-line
}

new AutocompleteJs('.autocomplete-1', {
  search,
  getResultValue,
  autoSelect: true,
  renderResults,
  onSubmit: handleSubmit,
})

new AutocompleteJs('.autocomplete-2', {
  search,
  getResultValue,
  autoSelect: true,
  renderResults,
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
      getResultValue,
    }
  },
})

new Vue({
  el: '#app-2',
  components: {
    autocomplete: AutocompleteVue,
  },
  data() {
    return {
      search,
      handleSubmit,
      getResultValue,
    }
  },
})
