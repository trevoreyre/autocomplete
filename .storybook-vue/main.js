export default {
  addons: ['@storybook/addon-actions'],
  stories: ['../packages/autocomplete-vue/**/*.stories.js'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
}
