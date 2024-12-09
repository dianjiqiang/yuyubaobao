'use strict';

const axios = require('axios')
const urlJoin = require('url-join')
const semver = require('semver')

async function getNpmInfo(npmName, registry){
    if (!npmName) {
        return null
    }
    const registryUrl = registry || getDefaultRegistry()

    const npmInfoUrl = urlJoin(registryUrl, npmName)
    return axios.get(npmInfoUrl).then(res => {
        if (res.status === 200) {
            return res.data
        }else{
            return null
        }
    }).catch(err => {
        return Promise.reject(err)
    })
}
  
function getDefaultRegistry(isOriginal = false){
    return isOriginal ? 'https://registry.npmjs.org/' : 'https://registry.npmmirror.com/'
}

async function getNpmVersion(npmName, registry){
    const data = await getNpmInfo(npmName ,registry)
    if (data) {
        return Object.keys(data.versions)
    }else{
        return []
    }
}

function getSemverVersions(baseVersion, versions){
    return versions.filter((version) => {
        if (version === baseVersion) {
            return false
        }else{
            return semver.satisfies(version, `^${baseVersion}`)
        }
    }).sort((a, b) => semver.gt(b,a))
    
}

async function getNpmSemverVersion(npmName, baseVersion, registry) {
    const versions = await getNpmVersion(npmName, registry)
    const newVersion = getSemverVersions(baseVersion, versions)
    return newVersion[0]
}

module.exports = {
    getNpmInfo,
    getNpmVersion,
    getSemverVersions,
    getNpmSemverVersion
}