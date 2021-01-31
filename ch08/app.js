//require

var express = require('express');
var http = require('http');
var serveStatic = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var expErrorHandler = require('express-error-handler');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var multer = require('multer');
var fs = require('fs');

var cors = require('cors');

var DEBUG = true;
//express 객체 생성

var app = express();
var router = express.Router();
app.use(cookieParser());
app.use(expressSession({
	secret  : 'xxxsecretxxx',
	resave 	: false,
	saveUninitialized : true 
}))

var errorHandler = expErrorHandler(
		{static : {
			'404' : './public/404.html'
		}}
	)

//middleware 등록 
app.use('/site', serveStatic(path.join(__dirname,'public')));
app.use('/uploads', serveStatic(path.join(__dirname, 'uploads')));

app.use(bodyParser.urlencoded({extended:false}));

var storage = multer.diskStorage({
	destination : function(req, file, callback){
		callback(null, 'uploads');
	},
	filename : function(req,file,callback){
		callback(null, Date.now()+'_'+file.originalname);
	}
})


var upload = multer({
	storage : storage,
	limits : {
		files : 1,
		filesize : 1024*1024*1024
	}
})


//라우터 
router.route('/process/download').get(function(req,res){
	console.log('downloading file');
	console.log(req.query.filename);

	var uploadpath = path.join(__dirname,'uploads')
	var filepath = path.join(uploadpath,req.query.filename);

	// console.log(mime.lookup(filepath));

	res.setHeader('Content-disposition', 'attachment; filename="'+req.query.filename+'"');
	// res.setHeader('Content-type', mime.lookup(filepath))



	var filestream = fs.createReadStream(filepath);
	filestream.pipe(res);


















});
router.route('/process/photo').post(upload.array('photo',1), function(req,res){
	console.log('uploading file');

	var files = req.files; //upload.single => req.file

	console.log('파일 정보 :');
	console.dir(files[0]);

	res.writeHead(200, {'Content-type':'text/html;charset=utf-8'});
	res.write('<h1> 업로드 성공!</h1>');
	res.write('</hr>');
	res.write('<h3> 파일 이름 : ' + files[0].originalname+'</h3>');
	res.write('<h3> 파일 경로 : ' +files[0].path+'</h3>');
	res.end();

})
router.route('/process/logout').get(function(req,res){
	if (DEBUG ){
		console.log('로그아웃 요청됨');
	}

	req.session.destroy(function(err){
		if(err){
			console.dir(err.stack);
			throw err;
		}

		console.log('세션 삭제됨');
		res.redirect('/site/login.html');

	})
})

router.route('/process/product').get(function(req,res){
	console.log('상품 페이지 접근 요청됨');

	console.dir(req.session);

	if (req.session.user){
		res.redirect('/site/product.html');
	} else {
		res.redirect('/site/login.html');
	}

})

router.route('/process/login').post(function(req, res){
	console.log('사용자 로그인 요청됨');

	var paramId = req.body.id;

	req.session.user = {
		id : paramId,
		name : '한종대',
		auth : true

	}

	res.writeHead(200, {'Content-type':'text/html;charset=utf-8'});
	res.write('<h1>Welcome!</h1>');
	res.write('<p>(id : '+paramId+' )</p>');
	res.write('<p> welcome, '+req.session.user.name+'! </p>');
	res.write('<a href = "/process/product">상품 정보 페이지 </a>');
	res.end();

})

router.route('/process/login').get(function(req,res){
	console.log('사용자 잘못된 경로로 로그인 요청');
	res.redirect('/site/login.html');
})

router.route('/process/login2').get(function(req,res){
	console.log('login2 접근 ');
	console.log('사용자 로그인 요청됨');
	res.write('<h1>Welcome!</h1>');
	res.write('<p>(id : '+req.query.id+' )</p>');
	res.end();
})



app.use(router);

// app.post('/site/login.html', function(req,res) {
// 	console.log('login post 요청 들어옴 ');
// 	res.send('id : '+req.body.id+', passwd : '+req.body.passwd);
// });
// app.use(function(req,res,next){
// 	console.log('사용자의 요청을 받음');

// 	res.writeHead('200',{'Content-type':'text/html;charset="utf-8"' } );
// 	res.end('<h1>Hello, world!</h1>');

// 	var paramName = req.query.name;
// 	console.log(paramName);
// 	console.log(req.url);

// 	var userAgent = req.header('User-agent');
// 	console.log(userAgent);


// });

// app.all('*', function(req,res){
// 	res.status(404).send('404 not found');
// })
app.use(expErrorHandler.httpError(404));
app.use(errorHandler);

//서버 구동

http.createServer(app).listen(3000, function(){
	console.log('express 서버 구동됨');
	console.log(path.join(__dirname,'public'));
})