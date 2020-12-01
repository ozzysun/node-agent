// const shell = require('shelljs')
const path = require('path')
const git = require('simple-git')
const { addFolder, removeFolder } = require('../utils/file')
const gitClone = async(rootPath, folderName, repoUrl, userName, pwd) => {
  const globalName = await gitConfig('user.name').catch(e => console.log(e))
  // 根目錄若不存在則新增
  await addFolder(rootPath)
  await removeFolder(`${rootPath}/${folderName}`)
  return new Promise((resolve, reject) => {
    // 有使用者名稱或密碼就帶入cloneUrl內
    if (userName === undefined && globalName !== null) userName = globalName.trim()
    if (userName !== undefined) repoUrl = pwd !== undefined ? `${userName}:${pwd}@${repoUrl}` : `${userName}@${repoUrl}`
    if (repoUrl.indexOf('http') === -1) repoUrl = `http://${repoUrl}`
    console.log(`clone repo=${repoUrl} rootPath=${rootPath}`)
    git(rootPath).silent(true).clone(repoUrl, (err, result) => {
      if (err) {
        console.log('err===')
        console.log(err)
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
// 取得指定的 git global 參數
const gitConfig = async(key) => {
  return new Promise((resolve, reject) => {
    git(path.resolve('.')).raw(['config', '--get', key], (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
// 當有branch 就做checkout
const gitCommit = async(workPath, branch = 'master', info = 'auto commit') => {
  const mygit = git(workPath)
  return new Promise((resolve, reject) => {
    mygit.checkout(branch, () => {
      mygit.add(['.'], () => {
        mygit.commit(['-m', info], (err, result) => {
          if (err) {
            reject(err)
          } else {
            mygit.push('origin', branch, (err1, result1) => {
              if (err1) {
                reject(err1)
              } else {
                resolve(result1)
              }
            })
          }
        })
      })
    })
  })
}
// checkout 與reset都會先將目前的branch 清空恢復再checkout
const gitReset = async(workPath, branch = 'master') => {
  const mygit = git(workPath)
  return new Promise((resolve, reject) => {
    mygit.raw(['reset', '--hard', 'HEAD'], () => {
      mygit.checkout(branch, () => {
        mygit.raw(['pull', 'origin', branch], (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })
    })
  })
}
const gitPull = async(workPath, branch = 'master') => {

}
const gitPush = async(workPath, branch = 'master') => {

}

module.exports = { gitClone, gitCommit, gitReset, gitPull, gitPush }
