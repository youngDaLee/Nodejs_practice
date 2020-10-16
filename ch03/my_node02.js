var http = require('http');
var fs = require('fs');

// 웹 서버 객체를 만듭니다.
var server = http.createServer(function(req, res) {
	// body...
	console.log('클라이언트 요청이 들어왔습니다.');
	var filename = "hello.html";

	fs.readFile(filename, function(err, data) {
		// body...
		if(err){
			console.log("파일 읽기 에러");
			server.close(function(args) {
				// body
			})
		}

		res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
		//에러안남
		res.write(data);
	});

	res.end();
});

// 웹 서버를 시작하여 3000번 포트에서 대기하도록 합니다.
// var port = 3001;
// server.listen(port, function() {
// 	console.log('웹 서버가 시작되었습니다. : %d', port);
// });

var host = '172.16.64.239';
var port = 3000;
server.listen(port, host, '511', function() {
	console.log('웹 서버가 시작되었습니다. : %s, %d', host, port);
});

server.on('connection', function(socket) {
	// body...
	console.log('client connected : %s %d', socket.remoteAddress, socket.remotePort)
});