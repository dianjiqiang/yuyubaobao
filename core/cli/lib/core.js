'use strict'

module.exports = core

const path = require('path')
const pkg = require('../package.json')
const semver = require('semver')
const log = require('@yuyubaobao/log')
const userHome = require('user-home')
const pathExists = require('path-exists').sync
const colors = require('colors')
const { LOWERST_NODE_VERSION, DEFAULT_ENV_PATH } = require('./const')
// import pathExists from 'path-exists'


const minimist = require('minimist')

const args = minimist(process.argv.slice(2))
let config  // 环境变量

async function  core() {
  try {
    checkPkgVersion()
    checkNodeVersion()
    checkRoot()
    checkUserHome()
    checkInputArgs()
    checkEnv()
    await checkGlobalUpdate()
  } catch (error) {
    log.error(error.message)
  }
}

function checkPkgVersion() {
  console.log('---------------yybb---------------')
  log.success('1.正在检查您的版本号', pkg.version)
}

function checkNodeVersion() {
  // 获取当前node版本号
  const currentNodeVersion = process.version

  // 比对最低版本号
  if (!semver.gte(currentNodeVersion, LOWERST_NODE_VERSION)) {
    throw new Error(colors.red('yuyubaobao 最低node版本为: ' + LOWERST_NODE_VERSION))
  }
  log.success('2.正在检查node版本', currentNodeVersion)
}

function checkRoot(){
  if(process.geteuid){
    const rootCheck = require('root-check')
    rootCheck()
    log.success('3.正在使用root降级')
  }else{
    log.success('3.您正在使用windows系统, 无需降级')
  }
}

function checkUserHome(){
  if(!userHome || !pathExists(userHome)){
    throw new Error(colors.red('4.您当前用户主目录不存在!'))
  }else{
    log.success('4.正在检查您的用户主目录', userHome)
  }
}

function checkInputArgs(){
  checkArgs(args)
}

function checkArgs(args){
  if (args.debug) {
    process.env.LOG_LEVEL = 'verbose'
    log.level = process.env.LOG_LEVEL
    log.success('5. 正在检查debug模式', '您正在使用debug模式')
  } else {
    log.success('5. 正在检查debug模式', '未使用debug模式')
  }
}

function createDefaultEnvConfig(){
  const cliConfig = {
    home: userHome,
  }
  if (process.env.CLI_HOME) {
    cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME)
  }else{
    cliConfig['cliHome'] = path.join(userHome, DEFAULT_ENV_PATH)
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome

  return cliConfig
}

function checkEnv(){
  const dotenv = require('dotenv')
  let envPath = path.resolve(userHome, '.env')
  if (pathExists(envPath)) {
    config = dotenv.config({
      path: envPath
    })
    log.success('6. 正在检查环境变量', '未读取到全局环境变量')
  }else{
    config = createDefaultEnvConfig()
    log.success('6. 正在检查环境变量', '已根据项目目录读取环境变量')
  }
}

async function checkGlobalUpdate(){
  //1. 获取当前版本号 和 模块名
  const currentVersion = pkg.version
  const npmName = pkg.name
  //2. 调用npm api, 获取所有版本号
  const { getNpmSemverVersion } = require('@yuyubaobao/get-npm-info')
  const newVersion = await getNpmSemverVersion(npmName, '1.0.15')
  if (newVersion) {
    log.success('7. 正在检查版本', '发现新版本, 正在更新...')
  }else{
    log.success('7. 正在检查版本', '您当前的版本为最新版本,无需更新')
  }
  
  //3. 提取所有版本号, 比对版本号
  //4. 获取所有版本号, 提示用户更新到新版本
}