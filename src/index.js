require('babel-core/register')
const Tesseract = require("tesseract.js")
const path = require("path")
const myImage = __dirname + '/ndf.jpeg'
// Tesseract.recognize(myImage)
//     .progress(message => console.log('1 : ', message))
//     .catch(err => console.error('2 : ', err))
//     .then(result => console.log('3 : ', result))
//     .finally(resultOrError => console.log('4 : ', resultOrError))

const tesseract = Tesseract.create({
  workerPath: path.join(__dirname, '../tesseract/src/node/worker.js'),
  langPath: path.join(__dirname, '../tesseract/langs/'),
  corePath: path.join(__dirname, '../tesseract/src/index.js')
})

console.log(path.join(__dirname, '../langs/'))

tesseract.recognize(myImage, { lang: 'eng' })
    .progress(function  (p) { console.log('progress', p)    })
    .then(function (result) { console.log('result', result.text) })

exports = module.exports = require('./app')
