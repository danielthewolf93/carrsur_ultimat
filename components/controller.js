const odbc = require('odbc')
require('dotenv').config()
const file = require('./file')
const wc = require('./wc')

var DSN = process.env['ODBC_DSN']
var UID = process.env['ODBC_UID']
var PWD = process.env['ODBC_PWD']

var lastdt = file.getLastDateTime('config.json')

module.exports.getProductsAdd = function (req, res) {
  const connection = odbc.connect(
    'DSN=' + DSN + ';UID=' + UID + ';PWD=' + PWD,
    (error, connection) => {
      var sql =
        `SELECT H.Producto_Id, H.Codigo, H.Descripcion, I.DESCRIPCION AS DESCRUBRO, 
            H.Costo, H.Venta, H.VentaMayorista, H.Iva, H.Fecha_Alta, H.Fecha_Modificacion, H.Foto,  
            H.Fecha_Baja, H.Status, H.Porc, H.Rubro_id, H.DescCorta, H.Unidad_id, H.FechaUltCambioPrecio 
            FROM Productos H 
                INNER JOIN Rubros I ON H.RUBRO_ID=I.RUBRO_ID 
                WHERE H.Status=0 AND H.Fecha_Alta>='` +
        lastdt +
        `'`

      connection.query(sql, (error, result) => {
        if (error) console.error(error)
        connection.close()

        res.statusCode = 200
        res.setHeader('content-Type', 'Application/json')
        res.end(JSON.stringify(result))
      })
    }
  )
}

module.exports.getProductsDel = function (req, res) {
  try {
    const connection = odbc.connect(
      'DSN=' + DSN + ';UID=' + UID + ';PWD=' + PWD,
      (error, connection) => {
        var sql =
          `SELECT H.Producto_Id, H.Codigo, H.Descripcion, I.DESCRIPCION AS DESCRUBRO, 
              H.Costo, H.Venta, H.VentaMayorista, H.Iva, H.Fecha_Alta, H.Fecha_Modificacion, H.Foto,  
              H.Fecha_Baja, H.Status, H.Porc, H.Rubro_id, H.DescCorta, H.Unidad_id, H.FechaUltCambioPrecio 
              FROM Productos H 
                  INNER JOIN Rubros I ON H.RUBRO_ID=I.RUBRO_ID 
                  WHERE H.Status=1 AND H.Fecha_Baja>='` +
          lastdt +
          `'`

        connection.query(sql, (error, result) => {
          if (error) console.error(error)
          connection.close()

          res.statusCode = 200
          res.setHeader('content-Type', 'Application/json')
          res.end(JSON.stringify(result))
        })
      }
    )
  } catch (error) {
    console.log(error)
  }
}

module.exports.getProductsUpd = function (req, res) {
  const connection = odbc.connect(
    'DSN=' + DSN + ';UID=' + UID + ';PWD=' + PWD,
    (error, connection) => {
      var sql =
        `SELECT H.Producto_Id, H.Codigo, H.Descripcion, I.DESCRIPCION AS DESCRUBRO, 
      H.Costo, H.Venta, H.VentaMayorista, H.Iva, H.Fecha_Alta, H.Fecha_Modificacion, H.Foto,  
      H.Fecha_Baja, H.Status, H.Porc, H.Rubro_id, H.DescCorta, H.Unidad_id, H.FechaUltCambioPrecio 
      FROM Productos H INNER JOIN Rubros I ON H.RUBRO_ID=I.RUBRO_ID 
      WHERE H.Status=0 AND H.Fecha_Modificacion >='` +
        lastdt +
        `' ORDER BY H.Fecha_Modificacion ASC`

      //FILTRO FECHA DESDE Y HASTA
      /*
      WHERE H.Status=0 AND H.Fecha_Modificacion >= '20210630' AND H.Fecha_Modificacion < '20210701' 
      ORDER BY H.Fecha_Modificacion ASC`
      */

      //FILTRO POR ID
      //WHERE H.Status=0 AND H.Codigo IN ('0011050') `

      //ORIGINAL
      /*WHERE H.Status=0 AND H.Fecha_Modificacion >='` +
      lastdt +
      `' ORDER BY H.Fecha_Modificacion ASC`
      */

      connection.query(sql, (error, result) => {
        if (error) console.error(error)

        //TODO: CONFIGURAR PARA QUE EL CHARSET DE LA BASE DE DATOS SEA UTF8
        //console.log(result[0])

        connection.close()

        res.statusCode = 200
        res.setHeader('content-Type', 'Application/json')
        res.end(JSON.stringify(result))
      })
    }
  )
}
