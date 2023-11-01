const http = require('http')
const url = require('url')

module.exports = http.createServer((req, res) => {
  var productOps = require('./controller')
  const reqUrl = url.parse(req.url, true)

  // GET Products To Add
  if (reqUrl.pathname == '/productsAdd' && req.method === 'GET') {
    productOps.getProductsAdd(req, res)
  }

  // GET Products To Delete
  if (reqUrl.pathname == '/productsDel' && req.method === 'GET') {
    productOps.getProductsDel(req, res)
  }

  // GET Products To Update
  if (reqUrl.pathname == '/productsUpd' && req.method === 'GET') {
    productOps.getProductsUpd(req, res)
  }
})
