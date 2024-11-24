'use strict'

module.exports = core

const pkg = require('../package.json')
const semver = require('semver')
const log = require('@yuyubaobao/log')
const colors = require('colors')
const { LOWERST_NODE_VERSION } = require('./const')

function core() {
  try {
    checkPkgVersion()
    checkNodeVersion()
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
