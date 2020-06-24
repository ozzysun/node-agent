// API Server 控制
const { exec } = require('./utils')
const { foreverStop, foreverIndex } = require('./forever')
const apiStart = (callback = null) => {
  try {
    apiStop()
  } catch (_error) {
    console(_error)
  }
  // const _path = global.config.git.pool + '/NODE_API_SERVER/bin'
  const _path = global.dir.bin
  const _cmdArray = ['forever start -a -w --watchDirectory . --watchIgnore *.log -o ../../NODE_CMD_SERVER/log/fout.log -e ../../NODE_CMD_SERVER/log/ferr.log --uid apiserver index.js']
  exec(_path, _cmdArray, (err, stdout, stderr) => {
    if (callback != null) callback(err, stdout, stderr)
  })
}
const apiStop = (callback) => {
  foreverIndex('apiserver', (err, index, stderr) => {
    if (index !== -1) {
      foreverStop(index, (err1, stdout, stderr1) => {
        if (callback != null) callback(err1, stdout, stderr1)
      })
    } else {
      if (callback != null) callback(err, 'apiserver not exist', stderr)
    }
  })
}
module.exports = { apiStart, apiStop }
