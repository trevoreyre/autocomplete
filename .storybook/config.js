import { configure } from '@storybook/vue'

const loadStories = () => {
  require('../packages/autocomplete-vue/stories.js')
}
configure(loadStories, module)
