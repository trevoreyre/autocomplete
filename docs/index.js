/* global Vue */
import AutocompleteJs from '../packages/autocomplete-js/index.js'
import AutocompleteVue from '../packages/autocomplete-vue/index.js'
import '../packages/autocomplete/autocomplete.css'
import data from './data'

const search = input => {
  if (input.length < 1) {
    return []
  }
  return data.filter(item => item.toLowerCase().startsWith(input.toLowerCase()))
}

// const renderResults = (results, selectedIndex) => {
//   return results
//     .map((result, index) => {
//       const isSelected = selectedIndex === index
//       let resultHtml = ''
//       if (index % 3 === 0) {
//         resultHtml += `<div style='padding:8px; background:black; color:white;'>SECTION</div>`
//       }
//       resultHtml += `
//       <li
//         id='autocomplete-result-${index}'
//         class='autocomplete-result'
//         role='option'
//         ${isSelected ? "aria-selected='true'" : ''}
//       >
//         <a href='#'>
//           ${result}
//         </a>
//       </li>
//     `
//       return resultHtml
//     })
//     .join('')
// }

const handleSubmit = value => {
  console.log('handleSubmit', value) // eslint-disable-line
}

new AutocompleteJs('.autocomplete', {
  search,
  autoSelect: true,
  // renderResults,
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
