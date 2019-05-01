import { configure, addDecorator, addParameters } from '@storybook/vue';
import { withStyles } from 'storybook-addon-styles/vue'
import '../packages/style.css'

addDecorator(withStyles)
addParameters({
  options: {
    showPanel: false
  },
  styles: {
    margin: '0 auto',
    padding: '40px 24px 0',
    maxWidth: '400px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
  }
})

function loadStories() {
  require('../packages/autocomplete-vue/Autocomplete.stories.js')
}

configure(loadStories, module);
