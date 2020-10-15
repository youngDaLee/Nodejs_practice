var url = require('url'); //node 내장모듈이기 때문에 별도 npm으로 다운받을 필요없음

var curURL = url.parse('https://www.google.com/search?q=node&rlz=1C1SQJL_koKR918KR918&oq=node&aqs=chrome..69i57j35i39l2j0l2j69i60l3.1122j0j9&sourceid=chrome&ie=UTF-8')

console.log(curURL);

var curStr = url.format(curURL)

console.log(curStr)