var calc = {}; //중괄호는 객체. calc 객체 선언함.
calc.add = function(a, b) { //java는 클래스 구조 미리 선언해야 하는데 js는 걍 붙이면 됨. 함수형 언어라 함수/변수 구분 안됨
	return a + b;
}

module.exports = calc