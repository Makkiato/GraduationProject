const app = require("express")();
const http = require("http");
const httpserver = http.createServer(app);
const io = require("socket.io")(httpserver);
var config = require("./config.js");

//pug activation
app.engine("pug", require("pug").__express);
app.set("view engine", "pug");
app.locals.pretty = true;

//connection checking
app.get("/", function (req, res) {
  res.status(200).send("OK : 200");
});

//webpage main
app.get("/main", function (req, res) {
  //simple copy
  var fiwareConfig = JSON.parse(JSON.stringify(config.orionCB));
  var reqType = req.query.type;
  if (reqType == null) fiwareConfig.path = "/v2/entities";
  else fiwareConfig.path = "/v2/entities?type=" + reqType;

  //get data from fiwareCB server
  http.get(fiwareConfig, function (response) {
    getFromCB(response, function (fiwareData) {
      //render pug page with data recieved from fiwareCB
      res.render(__dirname + "/adminMain.pug", {
        data: JSON.stringify(JSON.parse(fiwareData)),
      });
    });
  });
});


//using websocket
io.on("connection", function (socket) {
  console.log("socket on!");
  //detect select box change
  socket.on("change", function (data) {
    var writeData = {};
    writeData.value = data.value;

    //change data in fiwareCB with the data by client
    var fiwareConfig = JSON.parse(JSON.stringify(config.orionCB));
    fiwareConfig.method = "PUT";
    fiwareConfig.headers = {
      "Content-Type": "application/json",
      "Content-Length": JSON.stringify(writeData).length,
    };

    fiwareConfig.path = "/v2/entities/" + data.id + "/attrs";

    const req = http.request(fiwareConfig, function (res) {
      console.log(`statusCode: ${res.statusCode}`);
      var resData = "";
      res.on("data", (data) => {
        resData += data;
      });
      res.on("end", function () {
        console.log(resData);
        socket.emit("done", null);
      });
    });

    req.on("error", (error) => {
      console.log("error on putting data");
      console.error(error);
    });

    req.write(JSON.stringify(writeData));
    req.end();
  });
});

httpserver.listen(7777, function () {
  console.log("localhost:7777");
});

function getFromCB(response, callback) {
  var CBdata = "";
  response.on("data", function (chunk) {
    CBdata += chunk;
  });
  response.on("end", function () {
    //console.log("received server data:");
    //console.log(CBdata);
    callback(CBdata);
  });
}
