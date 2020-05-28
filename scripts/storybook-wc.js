const path = require('path')
const storybook = require('@storybook/web-components/standalone')

storybook({
  mode: 'dev',
  port: 4007,
  configDir: path.resolve(__dirname, '../.storybook-wc'),
})
