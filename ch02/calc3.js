var util = require('util')
var EventEmitter = require('events').EventEmitter

var Calc = function () {
	// body...
	var add = function(a, b) {
		return a+b
	}

	this.on('stop', function (argument) {
		// body...
		console.log('Stop 이벤트 발생');
	})
}

util.inherits(Calc, EventEmitter);

module.exports = Calc;