const express = require("express");
const app = express();
const http = require("http");
const httpserver = http.createServer(app);
app.use(express.json())


app.post("/income",function (req,res){
    console.log(req.body);    
    console.log(req.body.data[0].wanted);
    res.status(200).send("OK : 200");
})


  httpserver.listen(8844, function () {
    console.log("localhost:" + 8844);
  });
  

