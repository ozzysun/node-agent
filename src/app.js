const defaultSetting = require('./setting')
const { createConfFolder, loadConfig } = require('./config')
const { getRouter } = require('./core/net/router')
const { getChannelById, queueReceive } = require('./core/utils/mq-utils')
const mqInit = async({ hostData, hostId, channelId }) => {
  // 取得設定檔
  const mqConfig = hostData[hostId]
  // 建立連線 建立channel
  const channel = await getChannelById(mqConfig, channelId).catch(e => {
    console.log(e)
  })
  const queueArray = [
    {
      name: 'agent',
      handler: (channel, content, msg) => {
        console.log(`Received [agent][noAck: true] queue Rock!! %s`, content)
        channel.ack(msg)
      },
      option: {
        noAck: false
      }
    }
  ]
  await queueReceive(channel, queueArray)
}
const startServer = async(modifier = null) => { // 若需要在啟動時 強制修改config 可以 由這裏帶入
  // 建立預設的conf檔案
  await createConfFolder(defaultSetting)
  const configData = await loadConfig(defaultSetting, modifier)
  for (const prop in configData) {
    global[prop] = configData[prop]
  }
  // 監聽mq
  const mqOpt = {
    hostData: configData.mqHost,
    hostId: 'rabbitRD', // TODO: 需要依照環境改主機
    channelId: 'main'
  }
  await mqInit(mqOpt)
  // 啟動server { router, app, server }
  const result = await getRouter(global.config.port, './public', global.routes, global.require2)
  return result
}
module.exports = { startServer }
