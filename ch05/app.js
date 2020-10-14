var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var expressErrorHandler = require('express-error-handler');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var multer = require('multer');
var fs = require('fs');
var cors = require('cors');
var mime =require('mime');

var app = express();
var router = express.Router();


//미들웨어 시작 
// app.set('name', 'jongdae');

// console.log(app.get('name'));

app.use(cookieParser());
app.use(expressSession({
	secret:'my key',
	resave:false,
	saveUninitialized:true
}))

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
app.use('/uploads',static(path.join(__dirname,'uploads')) );

app.use(cors());

app.use(bodyParser.urlencoded({extended:false}))

var storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, 'uploads');
	},
	filename: function (req, file, callback) {
		callback(null, file.originalname+Date.now())
	}

}) ;

var upload = multer({
	storage: storage,
	limits:{
		file : 1,
		fileSize : 1024*1024*1024  //1GB
	}
})
// app.post('/public/login.html', function(req, res, next){
// 	console.log(req.body.id, req.body.password);
// 	res.send('<p> param id: ' + req.body.id +'</p>');
// 	next();
// })

//라우팅 코드 시작 

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
	// res.send('id :'+ req.body.id+' password : '+ req.body.password );
	console.log('로그인 성공 : ', req.body.id);
	req.session.user = {
		id : req.body.id,
		name : '한종대',
		authorized : true 
	}
	if(req.session.user) { //로그인에 성공했다면 
		res.redirect('/public/product.html');
	}
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

router.route('/process/photo').post(upload.array('photo', 1), function (req, res) {
	var file = req.files[0];

	// console.log('1st file : ');
	// console.dir(file);

	var mimetype = file.mimetype;
	var oriname = file.originalname;
	var size = file.size;

	res.send('file uploaded successfully : name = '+ oriname );

});

router.route('/process/download').get(function(req, res) {
	console.log('downloading file');
	console.log(req.query.filename);

	var uploadpath = path.join(__dirname,'uploads')
	var filepath = path.join(uploadpath,req.query.filename);

	// console.log(filepath);

	console.log(mime.lookup(filepath));

	res.setHeader('Content-disposition', 'attachment; filename="'+req.query.filename+'"');
	res.setHeader('Content-type', mime.lookup(filepath))



	var filestream = fs.createReadStream(filepath);
	filestream.pipe(res);

});



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
