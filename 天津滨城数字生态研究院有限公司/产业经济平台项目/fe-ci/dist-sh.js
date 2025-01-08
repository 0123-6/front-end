const { Client } = require('ssh2');
const chalk = require('chalk')
const path = require('path')
const compressing = require('compressing');
const rm = require('rimraf')
const fs = require("fs");

const SERVERS = require('./server.json')
const projects = require('./projects.json')

// 环境
const envs = process.argv[2].split(',')
const projectDir = process.argv[3]
const remoteDir = process.argv[4]
// 应用标识
const APPNAME = projects[projectDir] || projectDir
// 应用压缩包文件名
const ZIPNAME = APPNAME + '.zip'
// build产物目录
let DISTPATH = path.resolve(__dirname, `../${projectDir}/${APPNAME}`)

let TARGET_PATH = `/hiabr/${remoteDir ? 'remoteDir' + '/' : ''}web/`
if (projectDir === 'hiabr-website-web') {
  TARGET_PATH = '/var/local/web/'
} else if (projectDir === 'project-monitor-web') {
  TARGET_PATH = '/hiabr/web/'
  DISTPATH = path.resolve(__dirname, `../${projectDir}/dist/${APPNAME}`)
}

// build产物压缩包目录
const ZIPPATH = path.join(DISTPATH, '../' + ZIPNAME)

const doUnzip = process.argv[4] !== '-o'

console.log('DISTPATH', DISTPATH)

const exec = () => {
  if (envs) {
    envs.forEach(n => {
      SERVERS[n].forEach(m => {
        scpHandle(m, n)
      })
    })
  }
}

var scpHandle = (info, env) => {
  if (!info) {
    console.log(chalk.red(`【${env}】不存在`))
    return
  }
  console.log(chalk.yellow(`【${info.envname}】distributing...`))
  let conn = new Client()
  info.TARGET_PATH = info.TARGET_PATH || TARGET_PATH
  conn.on('ready', () => {
    conn.sftp((err, sftp) => {
      sftp.fastPut(ZIPPATH, info.TARGET_PATH + ZIPNAME, {}, (err) => {
        if (!err) {
          console.log(chalk.green(`【${info.envname}】${ZIPNAME}上传成功！`))
          if (doUnzip) {
            //上传完成后开始解压
            Shell(conn, info)
          } else {
            conn.end()
          }
        } else {
          console.log(chalk.red(`【${info.envname}】${ZIPNAME}上传失败：${err}`))
        }
      })
    })
  }).connect(info)
}

// 解压部署操作
function Shell(conn, info) {
  let ended = false
  conn.shell((err, stream) => {
    if (err) throw err;
    stream.on('close', function () {
      console.log(chalk.green(`【${info.envname}】${ZIPNAME}解压成功！${new Date()}`))
      ended = false
      conn.end();
    }).on('data', function (data) {
      // console.log('OUTPUT：' + data);
      // 进入根目录之后再执行shell命令
      if (!ended && data.indexOf(info.username + '@') > -1) {
        ended = true
        // `rm -rf ${APPNAME}`,
        stream.end([
          `cd ${info.TARGET_PATH}`,
          `unzip -o ${ZIPNAME}`,
          `rm -rf ${ZIPNAME}`,
          'exit',
          ''
        ].join('\n'))
      }
    }).stderr.on('data', function (data) {
      console.log('STDERR: ' + data);
    })
  })
}

const handleCompress = () => {
  compressing.zip.compressDir(DISTPATH, ZIPPATH)
    .then(() => {
      console.log(chalk.yellow(`【${ZIPNAME}】文件压缩成功，已压缩至【${ZIPPATH}】`));
      exec()
    })
    .catch((err) => {
      console.log(chalk.red(`【${ZIPNAME}】压缩报错`));
      console.error(err);
    });
}

const handleZip = () => {
  rm(ZIPPATH, err => {
    if (err) throw err
    console.log(chalk.yellow(`【${ZIPNAME}】删除成功`));
    handleCompress()
  })
}

handleZip()