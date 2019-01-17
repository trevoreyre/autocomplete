console.log('/autocomplete/rollup.config.js')
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify-es'
import vue from 'rollup-plugin-vue'

export default [{
  input: 'packages/autocomplete/index.js',
  output: [{
    file: 'packages/autocomplete/dist/autocomplete.cjs.js',
    format: 'cjs'
  }, {
    file: 'packages/autocomplete/dist/autocomplete.es.js',
    format: 'es'
  }],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}, {
  input: 'packages/autocomplete/index.js',
  output: {
    name: 'Autocomplete',
    file: 'packages/autocomplete/dist/autocomplete.min.js',
    format: 'iife'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    uglify()
  ]
}, {
  input: 'packages/autocomplete-js/index.js',
  output: [{
    file: 'packages/autocomplete-js/dist/autocomplete.cjs.js',
    format: 'cjs'
  }, {
    file: 'packages/autocomplete-js/dist/autocomplete.es.js',
    format: 'es'
  }],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}, {
  input: 'packages/autocomplete-js/index.js',
  output: {
    name: 'Autocomplete',
    file: 'packages/autocomplete-js/dist/autocomplete.min.js',
    format: 'iife'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    uglify()
  ]
}, {
  input: 'packages/autocomplete-vue/index.js',
  output: [{
    file: 'packages/autocomplete-vue/dist/autocomplete.cjs.js',
    format: 'cjs'
  }, {
    file: 'packages/autocomplete-vue/dist/autocomplete.es.js',
    format: 'es'
  }],
  plugins: [
    vue({
      css: false,
      compileTemplate: true,
      template: {
        isProduction: true
      }
    }),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}, {
  input: 'packages/autocomplete-vue/index.js',
  output: {
    name: 'Autocomplete',
    file: 'packages/autocomplete-vue/dist/autocomplete.min.js',
    format: 'iife'
  },
  plugins: [
    vue({
      css: false,
      compileTemplate: true,
      template: {
        isProduction: true
      }
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    uglify()
  ]
}]
