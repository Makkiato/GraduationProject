const app = require("express")();
const http = require("http");
const httpserver = http.createServer(app);
const io = require("socket.io")(httpserver);
var config = require("./config.js");

app.engine("pug", require("pug").__express);
app.set("view engine", "pug");
app.locals.pretty = true;

app.get("/", function (req, res) {
  res.status(200).send("OK : 200");
});

app.get("/main", function (req, res) {
  var fiwareConfig = JSON.parse(JSON.stringify(config.orionCB));
  var reqType = req.query.type
  if(reqType == null) fiwareConfig.path = "/v2/entities";
  else fiwareConfig.path = "/v2/entities?type="+reqType;

  http.get(fiwareConfig, function (response) {
    //console.log(fiwareConfig)
    getFromCB(response, function (fiwareData) {
      //console.log("fiware data\n"+fiwareData)

      res.render(__dirname + "/adminMain.pug", {
        data: JSON.stringify(JSON.parse(fiwareData)),
      });
    });
  });
});

io.on("connection", function (socket) {
  console.log("socket on!");
  socket.on("change", function (data) {
    var writeData = {};
    writeData.value = data.value;

    // fiware에 put 하기
    var dLength = Buffer.byteLength(JSON.stringify(data));
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
