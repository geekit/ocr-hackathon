const Tesseract = require("tesseract.js")
const path = require("path")
const _ = require("lodash")

const listCurrencies = require('./list-currencies.json')

module.exports = (req, res) => {
  const myImage = __dirname + '/../images/' + req.params.image_name

  const tesseract = Tesseract.create({
    workerPath: path.join(__dirname, '../../tesseract/src/node/worker.js'),
    langPath: path.join(__dirname, '../../tesseract/langs/'),
    corePath: path.join(__dirname, '../../tesseract/src/index.js')
  })


  tesseract.recognize(myImage, { lang: 'eng' })
    .then(function (result) {
        let splittedResult = result.text.split(/(\r\n|\n|\r)/gm)
        let finalResult = {
          date : "",
          total: "",
          tva: "",
          name:"",
          currency: "",
          all: splittedResult
        }
        finalResult.currency = getCurrency(result.text)
        for(let i = 0; i<splittedResult.length; i++){
          if(isDate(splittedResult[i]) === true){
            finalResult.date = getDate(splittedResult[i])
          }
          if(isTotal(splittedResult[i])){
            finalResult.total = getTotal(splittedResult[i])
          }
          if(isName(splittedResult[i])){
            finalResult.name = getName(splittedResult[i])
          }
          if(isTva(splittedResult[i])){
            finalResult.tva = getTva(splittedResult[i])
          }
        }

        res.status(200).json({ result : finalResult });
       })
};

function countOccurence(string,char) {
  console.log(string);
  console.log(char);
  var re = new RegExp(char,"gi");
  if(Array.isArray(string.match(re))) return string.match(re).length
  else return 0
}

function getMax(data){
  console.log(data)
  return _.maxBy(data, function(o) { return o; })
}

function getCurrency(text){
  let result=[]
  let currenciesCount = {}
  for(var currentCurency in listCurrencies){
    let symbol = listCurrencies[currentCurency].symbol
    let count = countOccurence(text,symbol)
    if(count > 0){
      currenciesCount.push = {symbol : symbol, count : count}
    }
  }
  console.log(getMax(currenciesCount))
}
function isDate(text){
  const regexPattern = /(\d{4}([.\-/ ])\d{2}\2\d{2}|\d{2}([.\-/ ])\d{2}\3\d{4})/
  return regexPattern.test(text)
}
function getDate(text){
  const regexPattern = /(\d{4}([.\-/ ])\d{2}\2\d{2}|\d{2}([.\-/ ])\d{2}\3\d{4})/gm
  return text.match(regexPattern)[0];
}

function isTotal(text){
  const regexPattern = RegExp('Total*');
  return regexPattern.test(text)
}
function getTotal(text){
  text.replace(',','.');
  const regexPattern = /[+-]?\d+(\,\d+)?/g
  return text.match(regexPattern)[0];
}

function isName(text){
  // regex total
}
function getName(text){

}

function isTva(text){
  // const regexPattern = RegExp('TVA*');
  // return regexPattern.test(text)
}
function getTva(text){
  // text.replace(',','.');
  // const regexPattern = /[+-]?\d+(\,\d+)?/g
  // return text.match(regexPattern)[0];
}
