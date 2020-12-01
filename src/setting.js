const path = require('path')
const process = require('process')
module.exports = {
  files: [
    {
      id: 'config',
      path: path.resolve('./conf/index.yml'),
      default: {
        name: 'apiserver',
        version: '0.0',
        port: 13579,
        redis: {
          enable: false,
          host: '127.0.0.1',
          port: 6379,
          password: ''
        },
        mq: {
          enable: false,
          host: 'rabbitLocal',
          channel: 'main',
          queue: 'socket'
        },
        cache: {
          enable: false,
          type: 'memcached',
          server: '127.0.0.1',
          port: 11211,
          expSec: 0
        },
        ssl: {
          enable: false,
          port: 443,
          key: './server.key',
          cert: './server.crt',
          requestCert: false,
          rejectUnauthorized: false
        },
        jwt: {
          default: {
            secret: 'Mojava3',
            alg: 'HS256',
            expDays: 7
          }
        },
        git: {
          repo: 'your git repo pool',
          poolFolder: '../',
          user: '',
          password: ''
        }
      }
    },
    {
      id: 'hosts',
      path: path.resolve('./conf/hosts.yml'),
      default: [{
        id: 'dbLocal',
        dbType: 'mysql',
        host: 'localhost',
        port: '3306',
        user: '',
        password: '',
        connectionLimit: 20
      }]
    },
    {
      id: 'routes',
      path: path.resolve('./conf/routes.yml'),
      default: [{
        id: 'sample',
        dir: 'routes/sample',
        ns: 'sample',
        common: 'sample api',
        enable: true
      }]
    },
    {
      id: 'mqHost',
      path: path.resolve('./conf/mqHost.yml'),
      default: {
        rabbitLocal: {
          config: {
            protocol: 'amqp',
            hostname: '127.0.0.1',
            port: 5672,
            username: 'admin',
            password: '5578360',
            frameMax: 0,
            heartbeat: 0,
            vhost: '/'
          },
          channel: {
            main: {
              isConfirm: false,
              queue: [
                { id: 'agent',
                  common: '發送agent廣播用',
                  option: { durable: false }
                }
              ],
              exchange: [
                { id: 'ex_hello',
                  common: '測試用',
                  type: 'direct',
                  option: { durable: false }
                }
              ]
            }
          }
        }
      }
    }
  ],
  dir: {
    root: process.cwd(), // 整個project根目錄 /ozapi
    bin: __dirname // 執行點的目錄 /ozpai/src 或 /ozapi/dist
  }
}
