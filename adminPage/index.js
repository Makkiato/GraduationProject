const app = require("express")();
const http = require("http");
const httpserver = http.createServer(app);
const io = require("socket.io")(httpserver);
const fc = require("./fiwareConnector");
var config = require("./config.js");

//pug activation
app.engine("pug", require("pug").__express);
app.set("view engine", "pug");
app.locals.pretty = true;

//connection checking
app.get("/", function (req, res) {
  res.status(200).send("OK : 200");
});

app.get("/version", function (req, res) {
  //simple copy
  var fiwareConfig = JSON.parse(JSON.stringify(config.orionCB));

  fiwareConfig.path = "/version";

  fc.getFiware(fiwareConfig, function (fiwareData) {
    res.send(fiwareData);
  });
});

//webpage main
app.get("/main", function (req, res) {
  //simple copy
  var fiwareConfig = JSON.parse(JSON.stringify(config.orionCB));
  var reqType = req.query.type;
  if (reqType == null) fiwareConfig.path = "/v2/entities";
  else fiwareConfig.path = "/v2/entities?type=" + reqType;

  fc.getFiware(fiwareConfig, function (fiwareData) {
    var useData = JSON.parse(fiwareData).filter((data) => data.type != "order");

    res.render(__dirname + "/adminMain.pug", {
      data: JSON.stringify(useData),
    });
  });
});

//using websocket
io.on("connection", function (socket) {
  setInterval(function () {
    console.log('Interval work')
    var fiwareConfig = JSON.parse(JSON.stringify(config.orionCB));
    fiwareConfig.path = "/v2/entities";
  
    fc.getFiware(fiwareConfig, function (fiwareData) {
      var useData = JSON.parse(fiwareData).filter(
        (data) => data.type != "order"
      );
      
      socket.emit("update", useData);
      
    });
  }, 3000);
  console.log("socket on!");
  //detect select box change
  socket.on("change", function (data) {
    var writeData = {
      order : {
        type : "order",
        value : data.order.value
      }
    };
    
    //console.log(data);
    //console.log(writeData);
    //change data in fiwareCB with the data by client
    var fiwareConfig = JSON.parse(JSON.stringify(config.orionCB));
    fiwareConfig.path = "/v2/entities/"+data.id+"/attrs";
    fc.postFiware(fiwareConfig, writeData, function (fiwareData) {
      console.log("something changed");
      socket.emit("done", null);
    });
  });
  
});

httpserver.listen(config.serverport, function () {
  console.log("localhost:" + config.serverport);
});
