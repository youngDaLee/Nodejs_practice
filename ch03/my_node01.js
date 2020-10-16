var http = require('http');

// 웹 서버 객체를 만듭니다.
var server = http.createServer();

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

server.on('request', function (req, res) {
	// body...
	console.log('클라이언트 요청이 들어왔습니다.');
	
	res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
	res.write("<!DOCTYPE html>");
	res.write("<html>");
	res.write("  <head>");
	res.write("    <title>응답 페이지</title>");
	res.write("  </head>");
	res.write("  <body>");
	res.write("    <h1>노드제이에스로부터의 응답 페이지</h1>");
	res.write("  </body>");
	res.write("</html>");

	res.end();
});
