var httpProxy = require('http-proxy'),
  url = require('url'),
	net = require('net'),
	http = require('http'),
  express = require('express'),
  curlify = require('request-as-curl'),
  app = express();


process.on('uncaughtException', logError);

function truncate(str) {
	var maxLength = 64;
	return (str.length >= maxLength ? str.substring(0,maxLength) + '...' : str);
}

function logRequest(req) {
	console.log(req.method + ' ' + truncate(req.url));
	for (var i in req.headers)
		console.log(' * ' + i + ': ' + truncate(req.headers[i]));
}

function logError(e) {
	console.warn('*** ' + e);
}

var regularProxy = new httpProxy.createProxyServer();

app.configure(function() {
  // app.use(express.static('public'));
  // app.use(express.cookieParser());
  // app.use(express.bodyParser());
  // app.use(express.session({ secret: 'keyboard cat' }));
  // app.use(passport.initialize());
  // app.use(passport.session());
  app.use(app.router);
});

app.get('*', function (req, res, next){
  logRequest(req);
  uri = url.parse(req.url);
  console.log('uri: '+JSON.stringify(uri));
  // res.end('nok');
  console.log('---------------------------');
  var curl = curlify(req);
  // fixing a bug in curlify that duplicate host in bash command generated
  var i1 = curl.indexOf("'");
  var i2 = curl.indexOf("'", i1+1);
  console.log(curl.substr(0, i1+1)+uri.href+curl.substr(i2, curl.length-i2));
  console.log('---------------------------');
  console.log('--->', uri.protocol+'//' + uri.hostname + ':'+(uri.port || 80));
  if (uri.hostname) {
    regularProxy.web(req, res, {
      target: uri.protocol+'//' + uri.hostname + ':'+(uri.port || 80)
    });
    // regularProxy.web(req, res, {
    //       target: 'http://localhost:8000'
    //     });
    // regularProxy.web(req, res);
  } else {
    next();
  }
});


app.listen(8000).on('connect', function(req, socket, head) {
  logRequest(req);
  var parts = req.url.split(':', 2);
  var conn = net.connect(parts[1], parts[0], function() {
    socket.write("HTTP/1.1 200 OK\r\n\r\n");
    socket.pipe(conn);
    conn.pipe(socket);
  });
});

regularProxy.on('error', function (err, req, res) {
  console.log(err);
});

// http.createServer(function (req, res) {
//   // res.writeHead(200, { 'Content-Type': 'text/plain' });
//   // res.write('request successfully proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
//   // res.end();
// }).listen(8000);
console.log("proxy in 8000");
