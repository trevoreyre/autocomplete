import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import commonjs from 'rollup-plugin-commonjs'
import vue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'
import copy from 'rollup-plugin-copy'

// Creates three bundles, a CommonJS bundle for Node, an ES modules bundle for use in
// other bundlers such as Webpack or Rollup, and an IIFE bundle for use in the browser
// in a <script> tag. All three bundles are transpiled to ES5 (with exception of
// the import/export statements in the ES bundle). Function is async to allow importing
// package.json file to reference for bundle names.
const createConfig = async ({ root, plugins = [] }) => {
  const pkg = await import(`./${root}/package.json`)
  return Promise.resolve([
    // CommonJS and ES modules bundles use same configuration with two outputs
    {
      input: `${root}/index.js`,
      output: [
        {
          file: `${root}/${pkg.main}`,
          format: 'cjs',
        },
        {
          file: `${root}/${pkg.module}`,
          format: 'esm',
        },
      ],
      plugins: [
        babel({
          exclude: 'node_modules/**',
        }),
        postcss({
          extract: `${root}/dist/style.css`,
          minimize: true,
        }),
        copy({
          targets: {
            LICENSE: `${root}/LICENSE`,
          },
        }),
        ...plugins,
      ],
    },
    // IIFE bundle uses separate configuration to minify JS as additional step
    {
      input: `${root}/index.js`,
      output: {
        name: 'Autocomplete',
        file: `${root}/${pkg.unpkg}`,
        format: 'iife',
      },
      plugins: [
        babel({
          exclude: 'node_modules/**',
        }),
        postcss({
          extract: `${root}/dist/style.css`,
          minimize: true,
        }),
        ...plugins,
        terser(),
      ],
    },
  ])
}

const config = async () => {
  const [
    autocompleteConfig,
    autocompleteJsConfig,
    autocompleteVueConfig,
  ] = await Promise.all([
    createConfig({ root: 'packages/autocomplete' }),
    createConfig({ root: 'packages/autocomplete-js' }),
    createConfig({
      root: 'packages/autocomplete-vue',
      plugins: [
        commonjs(),
        vue({
          css: false,
          compileTemplate: true,
          template: {
            isProduction: true,
          },
        }),
      ],
    }),
  ])

  return Promise.resolve([
    ...autocompleteConfig,
    ...autocompleteJsConfig,
    ...autocompleteVueConfig,
  ])
}

export default config
