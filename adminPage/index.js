const app = require('express')();
const http = require('http');
const httpserver = http.createServer(app);
const io = require('socket.io')(httpserver);
var config = require('./config.js')


app.get('/',function(req,res){
    res.status(200).send("OK : 200");
});

app.get('/main',function(req,res){
    var fiwareConfig = config.orionCB;
    fiwareConfig.path = '/version'
    var fiwareData;
    http.request(fiwareConfig, function(response){
        console.log(fiwareConfig)
        getFromCB(response,function(fiwareData){
            console.log("fiware data\n"+fiwareData)
        });
        
    }).end();
    
    res.sendFile(__dirname + '/adminMain.html')
})


io.on('connection', function(socket){
    console.log('socket on!')
    socket.on("change",function (data){
        console.log(data);
        socket.emit('done',null)
    })

})


httpserver.listen(7777,function(){
    console.log('localhost:7777')
})

function getFromCB(response,callback) {
    var CBdata = '';
    response.on('data', function (chunk) {
      CBdata += chunk;
    });
    response.on('end', function () {
      console.log("received server data:");
      console.log(CBdata);
      callback(CBdata)
    });
  }


