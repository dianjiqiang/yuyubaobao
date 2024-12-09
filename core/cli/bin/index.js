#! /usr/bin/env node
const importLocal = require('import-local')
const npmlog = require('npmlog')

if (importLocal(__filename)) {
  npmlog.info('cli', '正在使用yuyubaobao本地版本')
} else {
  require('../lib/core.js')(process.argv.slice(2))
}
