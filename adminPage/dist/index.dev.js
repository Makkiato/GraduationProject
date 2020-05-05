"use strict";

var app = require('express')();

var http = require('http');

var httpserver = http.createServer(app);

var io = require('socket.io')(httpserver);

var config = require('./config.js');

app.engine('pug', require('pug').__express);
app.set('view engine', 'pug');
app.locals.pretty = true;
app.get('/', function (req, res) {
  res.status(200).send("OK : 200");
});
app.get('/main', function (req, res) {
  var fiwareConfig = config.orionCB;
  fiwareConfig.path = '/v2/entities?type=led';
  var fiwareData;
  http.request(fiwareConfig, function (response) {
    console.log(fiwareConfig);
    getFromCB(response, function (fiwareData) {
      console.log("fiware data\n" + fiwareData);
      res.render(__dirname + '/adminMain.pug', {
        data: JSON.stringify(JSON.parse(fiwareData))
      });
    });
  }).end();
});
io.on('connection', function (socket) {
  console.log('socket on!');
  socket.on("change", function (data) {
    console.log(data);
    socket.emit('done', null);
  });
});
httpserver.listen(7777, function () {
  console.log('localhost:7777');
});

function getFromCB(response, callback) {
  var CBdata = '';
  response.on('data', function (chunk) {
    CBdata += chunk;
  });
  response.on('end', function () {
    console.log("received server data:");
    console.log(CBdata);
    callback(CBdata);
  });
}