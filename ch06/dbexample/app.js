var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var expressErrorHandler = require('express-error-handler');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var fs = require('fs');


var app = express();
var router = express.Router();


//미들웨어 시작 

var MongoClient = require('mongodb').MongoClient;

var database;

// 함수 정의들 
function connectDB() {
	var databaseUrl = 'mongodb://localhost:27017/';
	
	// 데이터베이스 연결
	MongoClient.connect(databaseUrl, function(err, db) {
		if (err) throw err;
		
		console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
		
		// database 변수에 할당
		database = db.db('local');
	});
}

function authUser(database, id, password, callback) {
	var users = database.collection('users'); //컬렉션 쿼리 

	users.find({'id': id , 'password':password}).toArray(function (err, docs) {
		if (docs.length > 0) { //로그인 성공
			callback(docs);
		} else { //로그인 실패 
			callback(null);  //authUser 호출시 콜백함수 (x) -> x == null/something
		}
	})
}

function addUser(database, id, password, name, callback) {
	var users = database.collection('users');

	users.insertOne({
		id : id,
		password : password,
		name : name
	}, function (err, result) {
		if (err) throw err;

		console.log("회원가입 성공 :"+id);
		callback(result);
	})
	
}


app.use(cookieParser());
app.use(expressSession({
	secret:'my key',
	resave:false,
	saveUninitialized:true
}))


app.use('/public',static(path.join(__dirname,'public')));
app.use('/uploads',static(path.join(__dirname,'uploads')) );

app.use(bodyParser.urlencoded({extended:false}))



//라우팅 코드 시작 
router.route('/process/register').post(function (req, res) {
	console.log('회원가입 시도 ');

	var paramId = req.body.id;
	var paramPassword = req.body.password;
	var paramName = req.body.name;

	addUser(database, paramId, paramPassword, paramName, function (result) {
		res.redirect('/public/login.html');
	})
})

router.route('/process/product').get(function (req, res) {
	console.log('product 페이지 접근')

	if(req.session.user) //가상의 로그인 성공 
	{ 
		res.redirect('/public/product.html')
	}	else { //로그인 안 되어있음 
		res.redirect('/public/login2.html')

	}
})

router.route('/process/login').post(function(req, res){

	var paramId = req.body.id ;
	var paramPassword = req.body.password;

	var callback = function (docs) {
		if (docs) {
			console.log('로그인 성공! '+docs[0].id);
			//세션에 정보 넣기
			req.session.user = {
				id : docs[0].id,
				name : docs[0].name 

			}
			console.dir(req.session.user);
			
			//res 결과 넣기
			res.redirect('/public/product.html');
		} else {
			console.log('로그인 실패! ');
			res.redirect('/public/login.html');
		}
	}

	authUser(database, paramId, paramPassword, callback)


})

router.route('/process/logout').get(function (req, res) {
	if (req.session.user) {
		req.session.destroy(function (err) {
			if(err) { throw err;}

			console.log('로그아웃 했습니다');
			res.redirect('/public/login2.html');
		})
	} else {
		res.redirect('/public/login2.html');
	}
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
	connectDB();
})
