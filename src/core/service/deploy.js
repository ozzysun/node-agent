// -- Deploy------------------
const deploy = (repoName, branch, group = 'all', callback = null) => {
  const config = global.config
  const infoArray = []
  let index = 0
  let urls
  if (branch === 'master') {
    if (group === 'all') {
      urls = []
      for (const key in config.deploy.master) {
        urls = urls.concat(config.deploy.master[key])
      }
    } else {
      urls = config.deploy.master[group]
    }
  } else {
    urls = config.deploy[branch]
  }
  let _err = null
  this.trace(urls)
  const run = () => {
    if (index < urls.length) {
      const url = `http://${urls[index]}:13579/service/git/pull/${repoName}/${branch}`
      this.proxy(url, null, 'GET', (err, httpResponse, body) => {
        body = JSON.parse(body)
        const info = {
          result: body.result,
          url,
          data: body.data
        }
        infoArray.push(info)
        if (body.result !== 'OK') _err = err
        index++
        run()
      })
    } else {
      if (callback !== null) callback(_err, infoArray)
    }
  }
  run()
}
module.exports = { deploy }
