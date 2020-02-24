import { addDecorator, addParameters } from '@storybook/html';
import { withStyles } from 'storybook-addon-styles/html'
import '../packages/style.css'
import '../.storybook-vue/style.css'

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
