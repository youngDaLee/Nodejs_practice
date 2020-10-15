var calc = {}; //중괄호는 객체. calc 객체 선언함.
calc.add = function(a, b) { //java는 클래스 구조 미리 선언해야 하는데 js는 걍 붙이면 됨. 함수형 언어라 함수/변수 구분 안됨
	return a + b;
}

console.log('result : %d', calc.add(10, 10)); //calc 라는 객체에 add라는 이름의 함수 선언함. add호출
console.log(calc.add)