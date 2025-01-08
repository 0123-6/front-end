const fs = require('fs')
const path = require('path')
const rollup = require('rollup')
const configs = require('./configs')

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}

build(configs)

function build (builds) {
  let built = 0
  const total = builds.length
  const next = () => {
    buildEntry(builds[built])
      .then(() => {
        built++
        if (built < total) {
          next()
        }
      })
      .catch(logError)
  }

  next()
}

function buildEntry ({ input, output }) {
  const { file } = output
  return rollup
    .rollup(input)
    .then(bundle => bundle.generate(output))
    .then(bundle => {
      // console.log(bundle)
      const code = bundle.output[0].code
      const map = bundle.output[0].map
      return write(file, code, map)
    })
}

function write (dest, code, map) {
  return new Promise((resolve, reject) => {
    function report (extra) {
      console.log(
        blue(path.relative(process.cwd(), dest)) +
          ' ' +
          getSize(code) +
          (extra || '')
      )
      resolve()
    }

    fs.writeFile(dest, code, err => {
      if (err) return reject(err)
      fs.writeFile(dest + '.map', map.toString(), err => {
        if (err) {
          return reject(err)
        }
      })
      report()
    })
  })
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError (e) {
  console.log(e)
}

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
