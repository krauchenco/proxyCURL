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

var regularProxy = new httpProxy.RoutingProxy();

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
  if (uri.hostname) {
    regularProxy.proxyRequest(req, res, {
      host: uri.hostname,
      port: uri.port || 80
    });
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
console.log("proxy in 8000");
