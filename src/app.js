const defaultSetting = require('./setting')
const { createConfFolder, loadConfig, getArgs } = require('./config')
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
  const args = getArgs()
  for (const prop in configData) {
    global[prop] = configData[prop]
  }
  // 監聽mq mq enable則啟動mq 連線
  const mqOpt = {
    hostData: configData.mqHost,
    hostId: 'rabbitRD', // TODO: 需要依照環境改主機
    channelId: 'main'
  }
  if (args.enable === null || args.enable) {
    if (configData.config.mq.enable) await mqInit(mqOpt)
  }
  // 啟動server { router, app, server }
  const port = args.port ? args.port : global.config.port
  const result = await getRouter(port, './public', global.routes, global.require2)
  return result
}
module.exports = { startServer }
