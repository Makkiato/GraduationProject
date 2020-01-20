var express = require('express');
var app = express();

app.get('/',function(req,res){
    res.sendStatus('200');
    console.log('successfully responded');
});

app.listen(8888,function(){
    console.log('server on!');
});