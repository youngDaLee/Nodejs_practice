var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var expressErrorHandler = require('express-error-handler');
var cookieParser = require('cookie-parser');


var app = express();
var router = express.Router();

router.route('/process/login').post(function(req, res){
	res.send('id :'+ req.body.id+' password : '+ req.body.password );
})

router.route('/process/login').get(function(req, res){
	res.send('로그인은 여기가 아님다');
})

router.route('/process/login/:name').post(function(req, res){
	res.send('welcome, '+req.params.name + '!');
})

router.route('/process/login/:name').get(function(req, res){
	res.send('welcome, '+req.params.name + '!');
})

router.route('/process/setUserCookie').get(function(req, res){
	res.cookie('user', {
		name : 'Jongdae',
		age : 22
	})
	console.log('쿠키 생성됨')

	res.redirect('/process/showCookie');
})

router.route('/process/showCookie').get(function(req, res){
	res.send(req.cookies)
})

// app.set('name', 'jongdae');

// console.log(app.get('name'));

app.use(cookieParser());

app.use(function(req, res, next){
	console.log('첫번째 미들웨어 시작');


	console.log(req.query.name, req.query.age)
	// res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
	// res.write('<h1>response from express!</h1>');
	// res.end();
	// res.redirect('http://google.co.kr')
	// res.send('<h1>hello, '+req.query.name+'</h1>');
	next();
});
// console.log('/public',path.join(__dirname,'public'));
app.use('/public',static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended:false}))

// app.post('/public/login.html', function(req, res, next){
// 	console.log(req.body.id, req.body.password);
// 	res.send('<p> param id: ' + req.body.id +'</p>');
// 	next();
// })

app.use('/', router);
// app.all('*', function(req, res){
// 	res.status(404).send('error');
// })
app.use(expressErrorHandler.httpError(404));
var errorHandler = expressErrorHandler({
	static:{
		'404' : './public/404.html'
	}
})

app.use(errorHandler);





http.createServer(app).listen(3000, function(){
	console.log('Express서버가 3000번 포트에서 시작됨');
})
