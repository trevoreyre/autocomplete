import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import vue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'
import copy from 'rollup-plugin-copy'
import { readFile } from 'fs/promises'

// Creates three bundles, a CommonJS bundle for Node, an ES modules bundle for use in
// other bundlers such as Webpack or Rollup, and an IIFE bundle for use in the browser
// in a <script> tag. All three bundles are transpiled to ES5 (with exception of
// the import/export statements in the ES bundle). Function is async to allow importing
// package.json file to reference for bundle names.
const createConfig = async ({
  root,
  plugins = [],
  external = [],
  globals = {},
}) => {
  const rootPackageJson = await readFile(`./${root}/package.json`)
  const pkg = JSON.parse(rootPackageJson.toString())
  return Promise.resolve([
    // CommonJS and ES modules bundles use same configuration with two outputs
    {
      external,
      input: `${root}/index.js`,
      output: [
        {
          file: `${root}/${pkg.main}`,
          format: 'cjs',
          globals,
        },
        {
          file: `${root}/${pkg.module}`,
          format: 'esm',
          globals,
        },
      ],
      plugins: [
        babel({
          babelHelpers: 'bundled',
          exclude: 'node_modules/**',
        }),
        postcss({
          extract: 'style.css',
          minimize: true,
        }),
        copy({
          targets: [{ src: 'LICENSE', dest: root }],
        }),
        ...plugins,
      ],
    },
    // IIFE bundle uses separate configuration to minify JS as additional step
    {
      external,
      input: `${root}/index.js`,
      output: {
        name: 'Autocomplete',
        file: `${root}/${pkg.unpkg}`,
        format: 'iife',
        globals,
      },
      plugins: [
        babel({
          babelHelpers: 'bundled',
          exclude: 'node_modules/**',
        }),
        postcss({
          extract: 'style.css',
          minimize: true,
        }),
        ...plugins,
        terser(),
      ],
    },
  ])
}

const config = async () => {
  const [autocompleteConfig, autocompleteJsConfig, autocompleteVueConfig] =
    await Promise.all([
      createConfig({ root: 'packages/autocomplete' }),
      createConfig({ root: 'packages/autocomplete-js' }),
      createConfig({
        root: 'packages/autocomplete-vue',
        external: ['vue'],
        globals: { vue: 'Vue' },
        plugins: [
          vue({
            css: false,
            template: {
              isProduction: true,
            },
          }),
          commonjs(),
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
