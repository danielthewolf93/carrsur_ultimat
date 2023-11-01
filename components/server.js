const main = require('./main')
require('dotenv').config()

const hostname = process.env['HOST']
const port = process.env['PORT']
const server = require('./routes') // imports the routing file

server.listen(port, hostname, () => {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
  //process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  console.log(`Server running at http://${hostname}:${port}/`)

  main.mainProcess()

  setTimeout(function () {
    server.close()
    return process.kill(process.pid)
  }, 180000)

  //180000
})
