const path = require('path')
const storybook = require('@storybook/html/standalone')

storybook({
  mode: 'dev',
  port: 4003,
  configDir: path.resolve(__dirname, '../.storybook-js'),
})
