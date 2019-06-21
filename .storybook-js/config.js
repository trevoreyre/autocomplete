import { configure, addDecorator, addParameters } from '@storybook/html';
import { makeDecorator } from '@storybook/addons'
// import { withStyles } from 'storybook-addon-styles/vue'
import '../packages/style.css'
import '../.storybook-vue/style.css'

const withStyles = makeDecorator({
  name: 'withStyles',
  parameterName: 'styles',
  skipIfNoParametersOrOptions: true,
  wrapper: (getStory, context, { options, parameters }) => {
    const root = document.createElement('div')
    Object.assign(root.style, options, parameters)

    const story = getStory(context)
    if (typeof story === 'string') {
      root.innerHTML = story
    } else if (story instanceof Node) {
      root.appendChild(story)
    }

    return root
  }
})

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
  require('../packages/autocomplete-js/Autocomplete.stories.js')
}

configure(loadStories, module);
