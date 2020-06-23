// 動態路徑無法build執行檔，以相對路徑導入
const RouteClass = require('../../../core/RouteClass')
class Route extends RouteClass {
  routes() {
    this.get('text', (req, res) => {
      res.send(`text`)
    })
    this.get('json', (req, res) => {
      this.json(res, { id: 'test', content: 'json' })
    })
  }
}
module.exports = Route
