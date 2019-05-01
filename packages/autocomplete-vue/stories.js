import { storiesOf } from '@storybook/vue'
import '../../docs/data/data'
import Autocomplete from './Autocomplete.vue'
import '../style.css'

const search = input => {
  if (input.length === 0) {
    return []
  }
  return window.countries.filter(country =>
    country.toLowerCase().startsWith(input.toLowerCase())
  )
}

storiesOf('Autocomplete', module)
  .add('Default', () => ({
    components: { Autocomplete },
    template: `<Autocomplete :search="search" />`,
    methods: {
      search: input => {
        if (input.length === 0) {
          return []
        }
        return window.countries.filter(country =>
          country.toLowerCase().startsWith(input.toLowerCase())
        )
      },
    },
  }))
  .add('Events', () => ({
    components: { Autocomplete },
    template: `
    <Autocomplete
      :search="search"
      @blur="handleBlur"
      @input="handleInput"
      :on-submit="handleSubmit"
    />
  `,
    methods: {
      search: input => {
        if (input.length === 0) {
          return []
        }
        return window.countries.filter(country =>
          country.toLowerCase().startsWith(input.toLowerCase())
        )
      },
      handleBlur(event) {
        console.log('handleBlur', event.target.value)
        this.handleSubmit(event.target.value)
      },
      handleInput(event) {
        console.log('handleInput', event)
      },
      handleSubmit(result) {
        alert(`You selected ${result}`)
      },
    },
  }))
