const path = require('path')
// 動態路徑無法build執行檔，以相對路徑導入
const RouteClass = require('../../../core/RouteClass')
const { apiStart, apiStop } = require('../../../core/service/api')
const { deploy } = require('../../../core/service/deploy')
const { gitClone, gitPull, gitCheckout, gitPush, gitBranch } = require('../../../core/service/gitCmd')
// 取得git使用資訊
const poolFolder = path.resolve(global.config.git.poolFolder)
const gitUser = global.config.git.user
const gitPassword = global.config.git.password
const getRepoUrl = (repoName) => {
  return `${global.config.git.repo}/${repoName}.git`
}
class Route extends RouteClass {
  routes() {
    // -- Git -------------------------
    this.get('git/clone/:repoName', async(req, res, next) => {
      console.log('')
      const folderName = req.params.repoName
      let err = ''
      await gitClone(poolFolder, folderName, getRepoUrl(req.params.repoName), gitUser, gitPassword).catch(e => { err = e })
      if (err === '') {
        this.json(res, `clone ${folderName} 完成`)
      } else {
        this.json(res, err)
      }
    })
    this.get('git/pull/:repoName/:branch', async(req, res, next) => {
      const { repoName, branch } = req.params
      const relationPath = `${poolFolder}/${repoName}`
      let err = ''
      await gitPull(relationPath, branch).catch(e => { err = e })
      if (err === '') {
        this.json(res, `pull ${repoName} 完成`)
      } else {
        this.json(res, err)
      }
    })
    this.get('git/checkout/:repoName/:branch', async(req, res, next) => {
      const { repoName, branch } = req.params
      const relationPath = `${poolFolder}/${repoName}`
      let err = ''
      await gitCheckout(relationPath, branch).catch(e => { err = e })
      if (err === '') {
        this.json(res, `checkout ${repoName} 完成`)
      } else {
        this.json(res, err)
      }
    })
    this.get('git/push/:repoName/:branch', async(req, res, next) => {
      const { repoName, branch } = req.params
      const relationPath = `${poolFolder}/${repoName}`
      const info = req.query.info ? req.query.info : 'auto commit'
      let err = ''
      await gitPush(relationPath, branch, info).catch(e => { err = e })
      if (err === '') {
        this.json(res, `push ${repoName} 完成`)
      } else {
        this.json(res, err)
      }
    })
    this.get('git/branch/:repoName', async(req, res, next) => {
      const { repoName } = req.params
      const relationPath = `${poolFolder}/${repoName}`
      let err = ''
      const result = await gitBranch(relationPath).catch(e => { err = e })
      if (err === '') {
        this.json(res, result)
      } else {
        this.json(res, err)
      }
    })
    // -- API Server ---------------------
    this.get('api/start', (req, res, next) => {
      apiStart((err, stdout, stderr) => {
        const resultObj = this.getResultObj('1012', '1013', err, stdout.toString(), stderr)
        this.json(res, resultObj, resultObj.info)
      })
    })
    this.get('api/restart', (req, res, next) => {
      apiStart((err, stdout, stderr) => {
        const resultObj = this.getResultObj('1012', '1013', err, stdout.toString(), stderr)
        this.responseHandler(req, res, next, resultObj)
      })
    })
    this.get('api/stop', (req, res, next) => {
      apiStop((err, stdout, stderr) => {
        const resultObj = this.getResultObj('1010', '1011', err, stdout.toString(), stderr)
        this.json(res, resultObj, resultObj.info)
      })
    })
    // -- Deploy  ---------------------
    this.get('deploy/:repoName/:branch', (req, res, next) => {
      const { branch, repoName } = req.params
      const group = 'all'
      deploy(repoName, branch, group, (err, stdout, stderr) => {
        const resultObj = this.getResultObj('1030', '1031', err, stdout.toString(), stderr)
        this.json(res, resultObj, resultObj.info)
      })
    })
    this.get('deploy/:repoName/:branch/:group', (req, res, next) => {
      const { branch, repoName, group } = req.params
      deploy(repoName, branch, group, (err, stdout, stderr) => {
        const resultObj = this.getResultObj('1030', '1031', err, stdout.toString(), stderr)
        this.json(res, resultObj, resultObj.info)
      })
    })
  }
  getResultObj(okCode, errCode, err, data, info) {
    return {
      result: err ? 'ERROR' : 'OK',
      code: err ? errCode : okCode,
      err: err,
      data: data,
      info: info
    }
  }
}
module.exports = Route
