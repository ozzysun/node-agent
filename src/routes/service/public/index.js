// 動態路徑無法build執行檔，以相對路徑導入
const RouteClass = require('../../../core/RouteClass')
const { apiStart, apiStop } = require('../../../core/service/api')
const { deploy } = require('../../../core/service/deploy')
const { gitClone, gitPull, gitCheckout, gitBranch } = require('../../../core/service/git')
class Route extends RouteClass {
  routes() {
    // -- Git -------------------------
    this.get('git/clone/:repoName', (req, res, next) => {
      gitClone(req.params.repoName, global.config.git.pool, (err, stdout, stderr) => {
        const resultObj = this.getResultObj('1004', '1005', err, stdout.toString(), stderr)
        this.json(res, resultObj, resultObj.info)
      })
    })
    this.get('git/pull/:repoName/:branch', (req, res, next) => {
      const { repoName, branch } = req.params
      const relationPath = `${global.config.git.pool}/${repoName}`
      gitPull(relationPath, branch, (err, stdout, stderr) => {
        const resultObj = this.getResultObj('1000', '1001', err, stdout.toString(), stderr)
        this.json(res, resultObj, resultObj.info)
      })
    })
    this.get('git/checkout/:repoName/:branch', (req, res, next) => {
      const { repoName, branch } = req.params
      const relationPath = `${global.config.git.pool}/${repoName}`
      gitCheckout(relationPath, branch, (err, stdout, stderr) => {
        const resultObj = this.getResultObj('1002', '1003', err, stdout.toString(), stderr)
        this.json(res, resultObj, resultObj.info)
      })
    })
    this.get('git/branch/:repoName', (req, res, next) => {
      const { repoName } = req.params
      const relationPath = `${global.config.git.pool}/${repoName}`
      gitBranch(relationPath, (err, stdout, stderr) => {
        const resultObj = this.getResultObj('1006', '1007', err, stdout.toString(), stderr)
        this.json(res, resultObj, resultObj.info)
      })
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
