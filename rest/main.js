var express = require('express');
var bp = require('body-parser');
var app = express();

app.use(bp.json());
app.use(bp.urlencoded({extended : false}));

app.get('/',function(req,res){
	
    res.status('200').json([
        {
            msg : "hello"
        }
    ]);
    console.log('successfully responded');
});

app.post('/',function(req,res){
    var parsedBody = req.body;
    console.log("got body");
    console.log(parsedBody);
    res.status(200).json(parsedBody);

});

app.listen(8888,function(){
    console.log('server on!');
});