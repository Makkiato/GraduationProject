var express = require('express');
var app = express();

app.get('/',function(req,res){
	
    res.sendStatus('200');
    console.log('successfully responded');
});

app.get('/echo',function(req,res){
	var echoMsg = req.query.msg;
	console.log(echoMsg);
	res.send(echoMsg);
	console.log('repeat '+echoMsg);
})

app.listen(8888,function(){
    console.log('server on!');
});
