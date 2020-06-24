// -- GIT --
const path = require('path')
const { exec } = require('./utils')
const gitClone = (repoName, _path, callback) => {
  _path = path.resolve(_path)
  const gitUrl = `http://gitadmin:git5578360@60.248.56.106:82/GitRepo/${repoName}.git`
  const cmdArray = [
    `git clone ${gitUrl}`
  ]
  exec(_path, cmdArray, (_err, stdout, stderr) => {
    const _cmdArray = [
      'git checkout -b develop',
      'git checkout -b stage'
    ]
    const __path = path.resolve(_path, repoName)
    exec(__path, _cmdArray, (__err, _stdout, _stderr) => {
      callback(__err, _stdout, _stderr)
    })
  })
}
const gitPull = (_path, branch, callback) => {
  branch = branch.replace('_', '/')
  const cmdArray = [
    `git reset --hard HEAD`,
    `git checkout ${branch}`,
    `git pull origin ${branch}`
  ]
  exec(_path, cmdArray, (err, stdout, stderr) => {
    callback(err, stdout, stderr)
  })
}
const gitCheckout = (_path, branch, callback) => {
  branch = branch.replace('_', '/')
  const cmdArray = [
    'git reset --hard HEAD',
    `git checkout ${branch}`
  ]
  exec(_path, cmdArray, (err, stdout, stderr) => {
    callback(err, stdout, stderr)
  })
}
const gitBranch = (_path, callback) => {
  const cmdArray = [
    'git rev-parse --abbrev-ref HEAD'
  ]
  exec(_path, cmdArray, (err, stdout, stderr) => {
    console.log(stderr)
    callback(err, stdout.trim())
  })
}
module.exports = { gitClone, gitPull, gitCheckout, gitBranch }
