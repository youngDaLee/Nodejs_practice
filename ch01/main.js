var calc = require('./calc2.js');
console.log('result : %d', calc.add(5,10));
console.log(calc.add(5,3)); //error(exports 하지 않았으므로.) -> java의 public, private와 비슷.