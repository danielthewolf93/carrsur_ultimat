const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default
require('dotenv').config()
var theLogger = require('./logger')
var URL_IMG = process.env['URL_IMG']
var theLogger = require('./logger')
var XMLHttpRequest = require('xhr2')

const WooCommerce = new WooCommerceRestApi({
  url: process.env['WC_URL'],
  consumerKey: process.env['WC_CONSUMER_KEY'],
  consumerSecret: process.env['WC_CONSUMER_SECRET'],
  version: process.env['WC_VERSION'],
  encoding: 'utf-8',
})

async function ifUrlExist(url, callback) {
  let request = new XMLHttpRequest()
  request.open('GET', url, true)
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
  request.setRequestHeader('Accept', '*/*')
  request.onprogress = function (event) {
    let status = event.target.status
    let statusFirstNumber = status.toString()[0]
    switch (statusFirstNumber) {
      case '2':
        request.abort()
        return callback(true)
      default:
        request.abort()
        return callback(false)
    }
  }
  request.send('')
}

const logger = theLogger.getLogger()

/* BEGIN Categories */
async function getCategories() {
  var result

  await WooCommerce.get('products/categories')
    .then((response) => {
      result = response.data
    })
    .catch((error) => {
      logger.error('WC get: ERROR al obtener categorias')
      console.log('WC get: ERROR al obtener categorias' + error)
    })

  return result
}

async function getCategoryByTitle(title) {
  var result

  params = {
    search: title,
  }
  await WooCommerce.get('products/categories', params)
    .then((response) => {
      result = response.data
      logger.debug(
        'WC get: Existe Category: ' + response.data[0].id + ' name: ' + response.data[0].name
      )
    })
    .catch((error) => {
      logger.error('WC get: ERROR al obtener categorias')
      logger.error(error)
      console.log('WC get: ERROR al obtener categorias ' + error)
    })

  return result
}

async function addCategory(product) {
  try {
    var categories = await getCategoryByTitle(product.DESCRUBRO)

    var catid = 0

    if (categories != null)
      categories.forEach((element) => {
        if (element.name === product.DESCRUBRO) {
          catid = element.id
        }
      })

    if (catid === 0) {
      const data = {
        name: product.DESCRUBRO,
      }

      await WooCommerce.post('products/categories', data)
        .then((response) => {
          cat = response.data
          logger.debug('WC post: OK agregar nueva categoria: ' + product.DESCRUBRO)
          console.log('WC post: OK agregar nueva categoria: ' + product.DESCRUBRO)
          return cat.id
        })
        .catch((error) => {
          logger.debug('WC post: ERROR al agregar nueva categoria: ' + product.DESCRUBRO)
          console.log('WC post: ERROR al agregar nueva categoria: ' + product.DESCRUBRO)

          if (error.response.data.code === 'term_exists') {
            return error.response.data.data.resource_id
          }
        })
    } else {
      return catid
    }
  } catch (error) {
    logger.error(error)
  }
}

/* END Categories */

/* BEGIN Products */

module.exports.addProduct = async function (product) {
  try {
    var prod = []

    params = {
      sku: product.Codigo,
    }

    await WooCommerce.get('products', params)
      .then((response) => {
        prod = response.data
      })
      .catch((error) => {
        //NOT AN ERROR, BECAUSE PRODUCT DOESNT EXIST IF NEW
        prod = []
      })

    if (prod.length < 1) {
      var category = await addCategory(product)

      /*if (product.Foto == null || product.Foto == '') vfoto = 'noimage.png'
      else vfoto = product.Foto*/
      vfoto = 'noimage.png'

      const data = {
        name: product.Descripcion,
        price: product.Venta,
        regular_price: product.Venta.toString(),
        short_description: product.DescCorta,
        sku: product.Codigo,
        images: [
          {
            src: URL_IMG + vfoto,
          },
        ],
        categories: [
          {
            id: category,
          },
        ],
      }

      if (product.Foto === null) delete data['images']

      await WooCommerce.post('products', data)
        .then((response) => {
          logger.debug('WC post: OK Agregar nuevo producto: ' + product.Codigo)
          console.log('WC post: OK Agregar nuevo producto: ' + product.Codigo)
        })
        .catch((error) => {
          logger.error('WC post: ERROR al Agregar nuevo producto: ' + product.Codigo)
          logger.error(error.response.data)
          console.log(
            'WC post: ERROR al Agregar nuevo producto: ' + product.Codigo + error.response.data
          )
          return false
        })
    } else {
      logger.debug('El producto con SKU ' + product.Codigo + ' para el alta ya existe.')
      console.log('El producto con SKU ' + product.Codigo + ' para el alta ya existe.')
    }
  } catch (error) {
    logger.debug('WC ERROR AddProduct: ' + error.response)
    console.log('WC ERROR AddProduct: ' + error.response)
  }
}

module.exports.delProduct = async function (product) {
  params = {
    sku: product.Codigo,
  }

  await WooCommerce.get('products', params)
    .then((response) => {
      prod = response.data
      logger.debug('WC get OK: Obtener producto por SKU: ' + product.Codigo)

      prod.forEach((element) => {
        WooCommerce.delete('products/' + element.id, {
          force: false,
        })
          .then((response) => {
            logger.debug('WC delete: OK Borrar producto por id: ' + element.id)
            console.log('WC delete: OK Borrar producto por id: ' + element.id)
          })
          .catch((error) => {
            logger.debug('WC delete: ERROR al intentar borrar producto por id: ' + element.id)
            logger.error(error.response.data)
            console.log(
              'WC delete: ERROR al intentar borrar producto por id: ' +
                element.id +
                error.response.data
            )
          })
      })
    })
    .catch((error) => {
      logger.debug('WC ERROR DelProduct: ' + error.response.data)
      console.log('WC ERROR DelProduct: ' + error.response.data)
    })
}

module.exports.updProduct = async function (product) {
  try {
    params = {
      sku: product.Codigo,
    }

    prod = []

    await WooCommerce.get('products', params)
      .then((response) => {
        prod = response.data
        logger.debug('WC get: OK obtener producto por SKU: ' + product.Codigo)
      })
      .catch((error) => {
        logger.debug('WC get: ERROR al obtener producto por SKU: ' + product.Codigo)
        console.log('WC get: ERROR al obtener producto por SKU: ' + product.Codigo + ' >> ' + error)
      })

    if (prod.length > 0) {
      //TODO: NODEJS CHECK IF REMOTE FILE EXISTS

      let deletePhotoParam = false
      vfoto = 'noimage.png'
      //CHEQUEO SI EL PRODUCTO YA TIENE UNA FOTO
      if (prod[0].images.length > 0) {
        //ME FIJO SI LA FOTO EXISTENTE NO ES noimage
        if (prod[0].images[0].name.includes('noimage')) {
          //SI ES noimage, ME FIJO SI EXISTE URLIMG Y PONGO ESA
          if (product.Foto == null || product.Foto == '') vfoto = 'noimage.png'
          else {
            await ifUrlExist(URL_IMG + product.Foto, function (exists) {
              if (exists) vfoto = product.Foto
              else vfoto = 'noimage.png'
            })
          }
        } else {
          //SI NO ES noimage, SACAR DE DATA EL CAMPO IMAGEN
          deletePhotoParam = true
        }
      } else {
        if (product.Foto == null || product.Foto == '') vfoto = 'noimage.png'
        else {
          //CHEQUEO SI EXISTE FOTO EN SERVIDOR Y SINO SE LE PONE LA DEFAULT
          //TODO: GENERAR EN LOG QUE FALTA SUBIR LA FOTO SI ES FALSE
          await ifUrlExist(URL_IMG + product.Foto, function (exists) {
            if (exists) vfoto = product.Foto
            else vfoto = 'noimage.png'
          })
        }
      }

      prod.forEach((element) => {
        const data = {
          name: product.Descripcion,
          price: product.Venta,
          regular_price: product.Venta.toString(),
          short_description: product.DescCorta,
          images: [
            {
              src: URL_IMG + vfoto,
            },
          ],
        }

        if (deletePhotoParam) delete data['images']

        WooCommerce.put('products/' + element.id, data)
          .then((response) => {
            logger.debug('WC put: OK al modificar producto por SKU: ' + product.Codigo)
            console.log(
              'WC put: OK Update producto: ' +
                product.Codigo +
                ' fecha modif ' +
                product.Fecha_Modificacion
            )
          })
          .catch((error) => {
            console.log(error.response.data.message)

            logger.debug('WC put: ERROR al modificar producto por SKU: ' + product.Codigo + error)
            console.log('WC put: ERROR al modificar producto por SKU: ' + product.Codigo + error)
          })
      })
    } else {
      logger.debug('WC get: ERROR de prod.length 0 por SKU: ' + product.Codigo)
      console.log(
        'WC ERROR Get para Modificación SKU: ' +
          product.Codigo +
          ' fecha alta ' +
          product.Fecha_Alta
      )
    }
  } catch (error) {
    logger.debug('WC ERROR UpdProduct: ' + error)
    console.log('WC ERROR UpdProduct: ' + error)
  }
}

/* END Products */
