const { exec } = require('./utils')
// -- Forever -----------------------
const foreverList = (callback = null) => {
  const _path = '.'
  const _cmdArray = ['forever list']
  exec(_path, _cmdArray, (err, stdout, stderr) => {
    if (callback !== null) callback(err, stdout, stderr)
  })
}
const foreverStop = (_index = 0, callback = null) => {
  const _path = '.'
  const _cmdArray = [`forever stop ${_index}`]
  exec(_path, _cmdArray, (err, stdout, stderr) => {
    if (callback !== null) callback(err, stdout, stderr)
  })
}
const foreverRestart = (_index = 0, callback = null) => {
  const _path = '.'
  const _cmdArray = [`forever restart ${_index}`]
  exec(_path, _cmdArray, (err, stdout, stderr) => {
    if (callback !== null) callback(err, stdout, stderr)
  })
}
const foreverIndex = (uid, callback = null) => {
  let index, lastStart, lastEnd, result
  this.foreverList((err, stdout, stderr) => {
    index = stdout.indexOf(uid)
    if (index !== -1) {
      lastStart = stdout.lastIndexOf('[', index)
      lastEnd = stdout.lastIndexOf(']', index)
      result = parseInt(stdout.substring(lastStart + 1, lastEnd))
    } else {
      result = -1
    }
    if (callback !== null) callback(err, result, stderr)
  })
}
module.exports = { foreverList, foreverStop, foreverRestart, foreverIndex }
