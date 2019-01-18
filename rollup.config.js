import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import vue from 'rollup-plugin-vue'

// Creates three bundles, a CommonJS bundle for Node, an ES modules bundle for use in
// other bundlers such as Webpack or Rollup, and an IIFE bundle for use in the browser
// in a <script> tag. All three bundles are transpiled to ES5 (with exception of
// the import/export statements in the ES bundle).
const createConfig = async ({ root, plugins = [] }) => {
  const pkg = await import(`./${root}/package.json`)
  return Promise.resolve([
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
        ...plugins,
        babel({
          exclude: 'node_modules/**',
        }),
      ],
    },
    {
      input: `${root}/index.js`,
      output: {
        name: 'Autocomplete',
        file: `${root}/${pkg.unpkg}`,
        format: 'iife',
      },
      plugins: [
        ...plugins,
        babel({
          exclude: 'node_modules/**',
        }),
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
