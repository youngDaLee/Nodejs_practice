var http = require('http');
var fs = require('fs');

// 웹 서버 객체를 만듭니다.
var server = http.createServer(function(req, res){
	console.log('클라이언트 요청 받음');
	
		var options = {
		host: 'www.google.com',
		port: 80,
		path: '/',
		method : 'GET'
	};

	var req2 = http.request(options, function(res2) {
	    // 응답 처리
	    var resData = '';
	    res2.on('data', function(chunk) {
	    	resData += chunk;
	    });

	    res2.on('end', function() {
	    	res.write(resData);
	    	res.end();
	    });	
	});

});

// // 웹 서버를 시작하여 3000번 포트에서 대기하도록 합니다.
// var port = 3001;
// server.listen(port, function() {
// 	console.log('웹 서버가 시작되었습니다. : %d', port);
// });

var host = '172.16.64.239';
var port = 3000;
server.listen(port, host, '511', function() {
	console.log('웹 서버가 시작되었습니다. : %s, %d', host, port);
});
