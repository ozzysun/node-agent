const path = require('path')
// 動態路徑無法build執行檔，以相對路徑導入
const RouteClass = require('../../../core/RouteClass')
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
      const opt = {
        rootPath: poolFolder,
        sub: req.query && req.query.sub ? req.query.sub : null,
        name: folderName,
        url: getRepoUrl(req.params.repoName),
        user: gitUser,
        pwd: gitPassword
      }
      await gitClone(opt).catch(e => { err = e })
      if (err === '') {
        this.json(res, `clone ${folderName} 完成`)
      } else {
        this.json(res, err)
      }
    })
    this.get('git/pull/:repoName/:branch', async(req, res, next) => {
      const { repoName, branch } = req.params
      const subFolder = req.query && req.query.sub ? req.query.sub : null // 判斷是否有子目錄
      const relationPath = subFolder !== null ? `${poolFolder}/${subFolder}/${repoName}` : `${poolFolder}/${repoName}`
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
      const subFolder = req.query && req.query.sub ? req.query.sub : null // 判斷是否有子目錄
      const relationPath = subFolder !== null ? `${poolFolder}/${subFolder}/${repoName}` : `${poolFolder}/${repoName}`
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
      const subFolder = req.query && req.query.sub ? req.query.sub : null // 判斷是否有子目錄
      const relationPath = subFolder !== null ? `${poolFolder}/${subFolder}/${repoName}` : `${poolFolder}/${repoName}`
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
      const subFolder = req.query && req.query.sub ? req.query.sub : null // 判斷是否有子目錄
      const relationPath = subFolder !== null ? `${poolFolder}/${subFolder}/${repoName}` : `${poolFolder}/${repoName}`
      let err = ''
      const result = await gitBranch(relationPath).catch(e => { err = e })
      if (err === '') {
        this.json(res, result)
      } else {
        this.json(res, err)
      }
    })
  }
}
module.exports = Route
