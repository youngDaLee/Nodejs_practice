var http = require('http');
var fs = require('fs');

// 웹 서버 객체를 만듭니다.
var server = http.createServer(function(req, res){
	console.log('클라이언트 요청 받음');
	var filename = "cat.png";

	fs.readFile(filename, function(err, data){
		if (err) {
			console.log("파일 읽기 에러");
			server.close(function(args) {
				// body
			})
		}
		res.writeHead(200, {"Content-Type": "image/png"});
		// 에러 안남 
		res.write(data);
		res.end();

	})

	
});

// // 웹 서버를 시작하여 3000번 포트에서 대기하도록 합니다.
// var port = 3001;
// server.listen(port, function() {
// 	console.log('웹 서버가 시작되었습니다. : %d', port);
// });

var host = '192.168.219.103';
var port = 3000;
server.listen(port, host, '511', function() {
	console.log('웹 서버가 시작되었습니다. : %s, %d', host, port);
});

