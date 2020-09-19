const express = require("express");
const app = express();
const http = require("http");
const httpserver = http.createServer(app);
app.use(express.json());

var subList = [];

function init(port, processOrder, callback) {
  app.post("/recieve", function (req, res) {
    res.status(200).send("OK : 200");
    var object = req.body.data[0];
    object.subId = req.body.subscriptionId;
    if (
      subList.findIndex(function (ele) {
        return ele.subId == object.subId;
      }) == -1
    ) {
      subList.push(object);
    }
    //console.log(subList)
    processOrder(object);
  });

  httpserver.listen(port, function () {
    console.log("localhost:" + port);
    callback();
  });
}

module.exports.init = init;
module.exports.subList = subList;
