function add(callback) {
	// body...
	var count =0;

	var history = function(){
		count++;
		return count
	}

	return history
}

var result = add(function() {
	// body...
	console.log('add 호출됨')
})

console.log(add()())
console.log(add()())
console.log(add()())
console.log()

console.log(result())
console.log(result())
console.log(result())