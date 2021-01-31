var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var expressErrorHandler = require('express-error-handler');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var fs = require('fs');
var cors = require('cors');
var mime =require('mime');


var app = express();
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;

var database;

//db연결
function connectDB() {
	var databaseUrl = 'mongodb://localhost:27017/';;
	
	MongoClient.connect(databaseUrl, function(err, db) {
		if (err) throw err;
		
		console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
		
		database = db.db('local');
	});
}


//메세지 추가
function addMessage(database, message, password, callback) {
	var users = database.collection('users');

	users.insertOne({
		message : message,
		password : password
	}, function (err, result) {
		if (err) throw err;

		console.log("메세지 보내기 성공 :"+ message + password);
		callback(result);
	})	
}

//메세지 출력(show)
function printMessage(database, password,callback){
	var users = database.collection('users');

	users.find({'password':password}).toArray(function(err,docs){
		if(docs.length > 0){
			console.log(docs[0])
			callback(docs);
		}else{
			callback(null);
		}
	})
}

app.use(cookieParser());
app.use(expressSession({
	secret:'my key',
	resave:false,
	saveUninitialized:true
}))

app.use('/static',static(path.join(__dirname,'static')));
app.use('/uploads',static(path.join(__dirname,'show')) );

app.use(cors());

app.use(bodyParser.urlencoded({extended:false}))


//비밀메세지 작성 페이지 라우팅
router.route('/exam/secret').get(function (req, res) {
	console.log('secret 페이지 접근')

	var paramMessage = req.body.message;
	var paramPassword = req.body.password;

	addMessage(database, paramMessage, paramPassword, function (result) {
		res.redirect('/static/secret.html');
	})
})


//비밀메세지 확인 페이지 라우팅
router.route('/exam/show').post(function (req, res){
	var paramPassword = req.body.password;

	var callback = function (docs) {
		if (docs) {
			console.log('로그인 성공!');
			res.redirect('/static/show.html');
		} else {
			console.log('로그인 실패! ');
			res.redirect('/static/error.html');
		}
	}

	printMessage(database, paramPassword, callback)
})


app.use('/', router);


http.createServer(app).listen(3000, function(){
	console.log('Express서버가 3000번 포트에서 시작됨');
	connectDB();
})

