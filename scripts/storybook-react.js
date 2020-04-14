const path = require('path')
const storybook = require('@storybook/react/standalone')

storybook({
  mode: 'dev',
  port: 4005, // TODO: change to 4006
  configDir: path.resolve(__dirname, '../.storybook-react'),
})
