const fs = require('fs')
var moment = require('moment')

function updConfigFile(file) {
  try {
    fs.readFile(file, function (err, openedFile) {
      if (err) console.log(err)

      //var theDate = moment().format('yyyyMMDD hhmm')
      var theDate = moment().format('MM-DD-yyyy HH:mm')
      if (openedFile.buffer.byteLength > 0) {
        var json = JSON.parse(openedFile)
        json['fechaultima'] = theDate

        fs.writeFile(file, JSON.stringify(json), function (err) {
          if (err) console.log(err)
        })
      } else {
        var json = JSON.stringify({fechaultima: theDate})
        fs.writeFile(file, json, function (err) {
          if (err) console.log(err)
        })
      }
    })

    return true
  } catch (error) {
    console.log(error)
  }
}

function getLastDateTime(file) {
  const res = () =>
    fs.readFileSync(file, function (err) {
      if (err) console.log(err)
    })

  var dt = JSON.parse(res())

  return dt.fechaultima
}

module.exports = exports = {
  updConfigFile,
  getLastDateTime,
}
