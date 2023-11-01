var moment = require('moment')
const log4js = require('log4js')

exports.getLogger = function () {
  var theDate = moment().format('yyyy_MM_DD')
  const fileName = 'logs/carrsur_' + theDate + '.log'
  log4js.configure({
    appenders: {carrsur: {type: 'file', filename: fileName}},
    categories: {default: {appenders: ['carrsur'], level: 'debug'}},
  })
  return log4js.getLogger('carrsur')
}
