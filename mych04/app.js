//Express 기본 패턴
//1단계 
//1. Express 기본 모듈 불러오기
var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');

//express 객체 생성
var app = express();
var router = express.Router();

router.route('/process/login').post(function(req, res){
	res.send('id : '+req.body.id+' password : '+req.body.password);
})

router.route('/process/login').get(function(req, res){
	res.send('로그인은 여기가 아닙니다.');
})

router.route('/process/login/:name').post(function(req,res){
	res.send('welcome, ' + req.params.name + '!');
})
router.route('/process/login/:name').get(function(req,res){
	res.send('welcome, ' + req.params.name + '!');
})
//얘네는 일단 무시함(app 연습)
// app.set('name', 'dayoung');
// console.log(app.get('name'));


//2단계 미들웨어 등록
//직접 미들웨어 객체를 만들어 설정
app.use(function(req, res, next){//(위치,매개변수(돌려줄 내용),다음 미들웨어)
	console.log('첫번째 미들웨어 요청을 처리함');


	console.log(req.query.name, req.query.age)

	// res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
	// res.end('<h1>Express 서버에서 응답한 결과입니다</h1>');
	//res.sendStatus(404);
	//res.send('<h1>Hello, '+req.query.name+'</h1>')
	//res.redirect('http://google.co.kr')
	next();
});

//console.log('/public',path.join(__dirname,'public'));
app.use('/public',static(path.join(__dirname,'public')))
app.use(bodyParser.urlencoded({exended:false}))

app.post('/public/login.html', function(req, res, next){
	console.log(req.body.id, req.body.password);
	res.send('<p> param id : '+ req.body.id +'</p>');
	next();
})

app.use('/', router);
app.all('*', function(req, res){
	res.send('error');
})

//3단계 서버 시작한다
//Express 서버 시작
http.createServer(app).listen(3000,function(){
	console.log('Express 서버가 3000번 포트에서 시작됨.');
})

