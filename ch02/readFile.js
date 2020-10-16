var fs = require('fs')

fs.readFile('./a.txt', 'utf8', function(err,data) {
	console.log(data)
});

console.log('a.txt 읽기'); 