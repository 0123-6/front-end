const axios = require('axios')
const path = require('path')
const fs = require('fs')
const c = require('ansi-colors');


// 后端微服务名称
let context = process.argv[2]
// swagger doc数据地址
let docUrl = `http://124.71.139.106/${context}/v2/api-docs`
let tagAlias = {}

let tags = []
let paths

axios.get(docUrl)
  .then(res => {
    paths = res.data.paths
    Object.keys(paths).filter(n => n != '/error').forEach(n => {
      let tag = (paths[n].get || paths[n].post || paths[n].put || paths[n].delete).tags[0]
      if (tags.indexOf(tag) < 0) {
        tags.push(tag)
        tagAlias[tag] = n.replace('/api', '').split('/')[1]
      }
    })
    tags.forEach(item => {
      // isFileExist(item)
      getPathArrByName(item)
    })
  })
  .catch(err => {
    console.log('Error: ', err.message);
  });

function isFileExist(name) {
  let filePath = `src/api/${context}/${tagAlias[name]}.js`
  fs.stat(path.join(__dirname, filePath), function (err, stats) {
    if (err || !stats.isFile()) {
      getPathArrByName(name)
    } else if (stats.isFile()) {
      console.log(c.red(`${filePath}已存在`))
    }
  })
}

function getPathArrByName(name) {
  let arr = []
  Object.keys(paths).forEach(key => {
    let pathObj = paths[key]
    let obj = pathObj[Object.keys(pathObj)[0]]
    if (obj.tags.indexOf(name) > -1) {
      arr.push({
        path: key,
        summary: obj.summary,
        method: Object.keys(pathObj)[0],
        name: key.replace('/api', '').replace('/', '').replace(/\//g, '_'),
        parameters: obj.parameters
      })
    }
  })
  generateCode(name, arr)
}

function generateCode(name, arr) {
  let strArr = [
    `import request from '@/utils/request'`
  ]
  arr.forEach(n => {
    const querys = n.parameters ? n.parameters.filter(p => p.in == 'query').map(p => `${p.name}=${'${'}params.${p.name}${'}'}`).join('&') : ''
    strArr.push(`
// ${n.summary}
export function ${n.name}(params) {
  return request({
    url: '/${context}${n.path.replace('/api', '')}'${n.method == 'post' && querys.length > 0 ? ` + ${'`'}?${querys}${'`'}` : ''},
    method: '${n.method}',
    ${n.method == 'get' ? 'params' : 'data: params'}
  })
}`
    )
  })
  createFile(name, strArr.join('\r\n'))
}

function createFile(name, str) {
  let filePath = `src/api/${context}/${tagAlias[name] || name}.js`
  fs.writeFile(path.join(__dirname, filePath), str, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log(c.green(`${filePath}写入成功！`));
  });
}