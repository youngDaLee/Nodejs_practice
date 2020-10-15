// callback 실습

var callback1 = function(result){
	console.log(result)
}

var callback2 = function(result){
	console.log('result is : ', result)
}


//fun까지만 치고 tab하면 기본 형태 나옴
var add = function function_name(a, b, callback) {
	// body...
	var result = a+b

	callback(result)

	var history = function () {
		// body... 지역변수 a, b, result`
		return a + '+' + b + '=' + result
	}
	return history
}

add(1,2,callback2)

var r = add(3,4,function(result) {
	// body... callback hell
	result = result+2
	console.log(result)
})

console.log(r())

console.log(add(5,6,function(result) {
	// body... callback hell
	result = result+2
	console.log(result)
})())