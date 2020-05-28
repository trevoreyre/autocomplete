const path = require('path')
const storybook = require('@storybook/react/standalone')

storybook({
  mode: 'dev',
  port: 4006,
  configDir: path.resolve(__dirname, '../.storybook-react'),
})
