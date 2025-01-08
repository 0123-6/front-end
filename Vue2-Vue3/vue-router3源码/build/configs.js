const path = require('path')
const buble = require('rollup-plugin-buble')
const flow = require('rollup-plugin-flow-no-whitespace')
const cjs = require('@rollup/plugin-commonjs')
const node = require('@rollup/plugin-node-resolve').nodeResolve
const replace = require('rollup-plugin-replace')
const version = process.env.VERSION || require('../package.json').version
const banner = `/*!
  * vue-router v${version}
  * (c) ${new Date().getFullYear()} Evan You
  * @license MIT
  */`

const resolve = _path => path.resolve(__dirname, '../', _path)

module.exports = [
  {
    input: resolve('src/entries/esm.js'),
    file: resolve('dist/vue-router.esm.browser.js'),
    format: 'es',
    env: 'development',
    transpile: false
  }
].map(genConfig)

function genConfig (opts) {
  const config = {
    input: {
      input: opts.input || resolve('src/index.js'),
      plugins: [
        flow(),
        node(),
        cjs(),
        replace({
          __VERSION__: version
        })
      ],
      external: ['vue']
    },
    output: {
      file: opts.file,
      format: opts.format,
      banner,
      name: 'VueRouter',
      sourcemap: true,
    }
  }

  if (opts.env) {
    config.input.plugins.unshift(
      replace({
        'process.env.NODE_ENV': JSON.stringify(opts.env)
      })
    )
  }

  if (opts.transpile !== false) {
    config.input.plugins.push(buble())
  }

  return config
}
