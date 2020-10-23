var express = require('express');
var http = require('http');
var multer = require('multer');
var path = require('path');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var expressErrorHandler = require('express-error-handler');
var static = require('serve-static');
var fs = require('fs');
var cors = require('cors');


var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({extended : false}))

app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));

app.use(cors());

app.use(expressSession({
	secret:'my key',
	resave:false,
	saveUninitialized:true
}))




var storage = multer.diskStorage({
	destination: function(req, file, callback){
		callback(null, 'uploads')
	},
	filename : function(req, file, callback){
		callback(null, file.originalname + Date.now())
	}
});
var upload = multer({
	storage: storage,
	limits: {
		file: 1,
		fileSize: 1024*1024*1024
	}
})


router.route('/process/photo').post(upload.array('photo',1), function(req, res){
	var file = req.files[0];

	var mimetype = file.mimetype;
	var oriname = file.originalname;
	var filename = file.filename
	var size = file.size;

	res.send(200, 'file uploaded succesffuly : name = '+oriname +' img = '+ '<img src="/uploads/'+filename+'" width = 200px>');
})


router.route('/process/upload').get(function(req, res) {
	console.log('uplode file');
	console.log(req.query.filename);

	var uploadpath = path.join(__dirname,'uploads')
	var filepath = path.join(uploadpath,req.query.filename);


	console.log(mime.lookup(filepath));

	res.setHeader('Content-disposition', 'attachment; filename="'+req.query.filename+'"');
	res.setHeader('Content-type', mime.lookup(filepath))



	var filestream = fs.createReadStream(filepath);
	filestream.pipe(res);

});


app.use('/', router);

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
