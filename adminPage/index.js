const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const host = '127.0.0.1'
const port = 7777;

app.get('/',function(req,res){
    res.status(200).send("OK : 200");
});

app.get('/main',function(req,res){
    res.sendFile(__dirname + '/adminMain.html')
})

io.on('connection', function(socket){
    console.log('socket on!')
    socket.on("change",function (data){
        console.log(data);
        socket.emit('done',null)
    })

})


http.listen(port,function(){
    console.log(host+':'+port.toString())
})