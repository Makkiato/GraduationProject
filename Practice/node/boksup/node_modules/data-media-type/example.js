var http = require('http');
var DataMediaType = require('./');

http.createServer(function(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', DataMediaType.JSON);

  var body = {
    hello: 'world'
  };

  res.end(JSON.stringify(body));
}).listen(1337);
