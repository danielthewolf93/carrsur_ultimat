var theLogger = require('./logger')
const request = require('request')
const wc = require('./wc')
const file = require('./file')
require('dotenv').config()
var sleep = require('system-sleep')

exports.mainProcess = function () {
  const logger = theLogger.getLogger()
  logger.debug('Starting process...')

  const urlBase = process.env['PROTOCOL'] + '://' + process.env['HOST'] + ':' + process.env['PORT']

  //1# >> TRAER LOS PRODUCTOS PARA ALTA CON PARAM FECHADESDE
  const reqAdd = {
    url: urlBase + '/productsAdd',
    method: 'GET',
    json: {},
    qs: {offset: 20},
  }

  request(reqAdd, (err, response, body) => {
    try {
      if (err) {
        throw err
      } else if (response.statusCode === 200) {
        logger.debug('CREATION - TOTAL OBJECTS: ' + body.length)
        console.log('CREATION - TOTAL OBJECTS: ' + body.length)

        body.forEach((element) => {
          logger.debug('CREATE - OBJECT ID: ' + element.Codigo)
          console.log('CREATE - OBJECT ID: ' + element.Codigo)
          wc.addProduct(element)
        })
      } else {
        logger.debug('CREATION - Status Code: ' + response.statusCode)
        console.log('CREATION - Status Code: ' + response.statusCode)
      }
    } catch (e) {
      logger.error('Error al traer los productos para ALTA.')
      console.log('Error al traer los productos para ALTA.')
    }
  })

  //2# >> TRAER LOS PRODUCTOS PARA BAJA CON PARAM FECHADESDE
  const reqDel = {
    url: urlBase + '/productsDel',
    method: 'GET',
    json: {},
    qs: {offset: 20},
  }
  request(reqDel, (err, response, body) => {
    try {
      if (err) {
        throw err
      } else if (response.statusCode === 200) {
        logger.debug('DELETE - TOTAL OBJECTS: ' + body.length)
        console.log('DELETE - TOTAL OBJECTS: ' + body.length)

        body.forEach((element) => {
          logger.debug('DELETE - OBJECT ID: ' + element.Codigo)
          console.log('DELETE - OBJECT ID: ' + element.Codigo)
          wc.delProduct(element)
        })
      } else {
        logger.debug('DELETE - Status Code: ' + response.statusCode)
        console.log('DELETE - Status Code: ' + response.statusCode)
      }
    } catch (e) {
      logger.error('Error al traer los productos para BAJA.')
      console.log('Error al traer los productos para BAJA.')
    }
  })

  //3# >> TRAER LOS PRODUCTOS PARA MODIFICACIÓN CON PARAM FECHADESDE
  const reqUpd = {
    url: urlBase + '/productsUpd',
    method: 'GET',
    json: {},
    qs: {offset: 20},
  }

  request(reqUpd, (err, response, body) => {
    try {
      if (err) {
        throw err
      } else if (response.statusCode === 200) {
        logger.debug('UPDATE - TOTAL OBJECTS: ' + body.length)
        console.log('UPDATE - TOTAL OBJECTS: ' + body.length)

        body.forEach((element, itm) => {
          logger.debug('UPDATE - OBJECT ID: ' + element.Codigo)
          console.log(
            'UPDATE - OBJECT ID: ' + element.Codigo + ' ITM Nbr: ' + itm + ' de ' + body.length
          )

          sleep(3000)
          wc.updProduct(element)
        })
      } else {
        logger.debug('UPDATE - Status Code: ' + response.statusCode)
        console.log('UPDATE - Status Code: ' + response.statusCode)
      }
    } catch (e) {
      logger.error('Error al traer los productos para MODIFICACIÓN.')
      console.log('Error al traer los productos para MODIFICACIÓN.')
    }
  })

  //4# >> ACTUALIZA ULTIMA FECHA HORA
  logger.debug('Last DateTime Running Updated: ' + file.updConfigFile('config.json'))

  return true
}
