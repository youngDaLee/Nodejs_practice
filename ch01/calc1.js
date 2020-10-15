exports.add=function(a,b){
	return a+b;
}

var sub=function(a,b){
	return a-b;
}

console.log(sub(5,3))

exports.subex=function(a,b){
	return a-b;
}

console.log(subex(5,3))//exports했기때문에 calc1에서는 못씀 -> 해결: calc2.js