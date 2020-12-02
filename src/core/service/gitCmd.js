// const shell = require('shelljs')
const path = require('path')
const git = require('simple-git')
const { addFolder, removeFolder } = require('../utils/file')
// rootPath:pool所在根目錄路徑,sub:子目錄名稱,name:git名稱,url:repo所在路徑(不是完整)
// user:git使用者帳號 pwd:git使用者密碼 
const gitClone = async({ rootPath, sub = null, name, url, user, pwd }) => {
  const globalName = await gitConfig('user.name').catch(e => console.log(e))
  // 根目錄若不存在則新增
  rootPath = sub !== null ? `${rootPath}/${sub}` : rootPath
  await addFolder(rootPath)
  await removeFolder(`${rootPath}/${name}`)
  return new Promise((resolve, reject) => {
    // 有使用者名稱或密碼就帶入cloneUrl內
    if (user === undefined && globalName !== null) user = globalName.trim()
    if (user !== undefined) url = pwd !== undefined ? `${user}:${pwd}@${url}` : `${user}@${url}`
    if (url.indexOf('http') === -1) url = `http://${url}`
    console.log(`clone repo=${url} rootPath=${rootPath}`)
    git(rootPath).silent(true).clone(url, (err, result) => {
      if (err) {
        reject(err.toString())
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
// 當有branch 就做checkout commit
const gitCommit = async(workPath, branch = 'master', info = 'auto commit') => {
  const mygit = git(workPath)
  return new Promise((resolve, reject) => {
    mygit.checkout(branch, () => {
      mygit.add(['.'], () => {
        mygit.commit(['-m', info], (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      })
    })
  })
}
// checkout 先將目前的branch 清空恢復再checkout
const gitCheckout = async(workPath, branch = 'master') => {
  const mygit = git(workPath)
  return new Promise((resolve, reject) => {
    mygit.raw(['reset', '--hard', 'HEAD'], () => {
      mygit.checkout(branch, (err) => {
        if (err) {
          reject(err.toString())
        } else {
          resolve()
        }
      })
    })
  })
}
// 當有branch 就做checkout commit
const gitBranch = async(workPath) => {
  const mygit = git(workPath)
  return new Promise((resolve, reject) => {
    //   HEAD
    mygit.raw(['rev-parse', '--abbrev-ref', 'HEAD'], (err, result) => {
      console.log('err==')
      console.log(err)
      console.log('result==')
      console.log(result)
      if (err) {
        reject(err)
      } else {
        resolve(result.trim())
      }
    })
  })
}
// checkout + pull 會先清空異動未commit部份 再進行pull
const gitPull = async(workPath, branch = 'master') => {
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
// commit + push
const gitPush = async(workPath, branch = 'master', info = 'auto commit') => {
  const mygit = git(workPath)
  return new Promise((resolve, reject) => {
    mygit.checkout(branch, () => {
      mygit.add(['.'], () => {
        mygit.commit([info], (err, result) => {
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

module.exports = { gitClone, gitCommit, gitCheckout, gitPull, gitPush, gitBranch }
