var fs = require('fs')

var data = fs.readFileSync('./a.txt', 'utf8')

console.log(data)