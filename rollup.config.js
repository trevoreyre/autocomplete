import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify-es'
import vue from 'rollup-plugin-vue'

// Creates three bundles, a CommonJS bundle for Node, an ES modules bundle for use in
// other bundlers such as Webpack or Rollup, and an IIFE bundle for use in the browser
// in a <script> tag. All three bundles are transpiled to ES5 (with exception of
// the import/export statements in the ES bundle).
const createConfigs = ({ root = '', plugins = [] }) => {
  return [{
    input: `${root}/index.js`,
    output: [{
      file: `${root}/dist/autocomplete.cjs.js`,
      format: 'cjs'
    }, {
      file: `${root}/dist/autocomplete.es.js`,
      format: 'es'
    }],
    plugins: [
      ...plugins,
      babel({
        exclude: 'node_modules/**'
      })
    ]
  }, {
    input: `${root}/index.js`,
    output: {
      name: 'Autocomplete',
      file: `${root}/dist/autocomplete.min.js`,
      format: 'iife'
    },
    plugins: [
      ...plugins,
      babel({
        exclude: 'node_modules/**'
      }),
      uglify()
    ]
  }]
}

export default [
  ...createConfigs({
    root: 'packages/autocomplete'
  }),
  ...createConfigs({
    root: 'packages/autocomplete-js'
  }),
  ...createConfigs({
    root: 'packages/autocomplete-vue',
    plugins: [
      vue({
        css: false,
        compileTemplate: true,
        template: {
          isProduction: true
        }
      })
    ]
  })
]
