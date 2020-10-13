const app = require("express")();
const http = require("http");
const httpserver = http.createServer(app);
const io = require("socket.io")(httpserver);
const fc = require("./fiwareConnector");
const hi = require("./history");
const sql = require("./sqlConnector").init();

var config = require("./config.js");
var currentWatching = {};
var latest = {};

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

app.get("/service", function (req, res) {
  res.sendFile(__dirname + "/FrameMain.html");
  io.on("connection", function (socket) {
    setInterval(function () {
      socket.emit("update", latest);
    }, 3000);
    console.log("socket on!");
    //detect select box change
    socket.on("disconnect", function () {
      // your action on user disconnect
      console.log('disconnect')
      //socket.emit('disconnect')
      socket.broadcast.to(socket.chatroom).emit('emitdisconnect');
    });
    socket.on("change", function (data) {
      var writeData = {
        order: {
          type: "order",
          value: data.order.value,
        },
      };

      //console.log(data);
      //console.log(writeData);
      //change data in fiwareCB with the data by client
      var fiwareConfig = JSON.parse(JSON.stringify(config.orionCB));
      fiwareConfig.path = "/v2/entities/" + data.id + "/attrs";
      fc.postFiware(fiwareConfig, writeData, function (fiwareData) {
        console.log("something changed");
        console.log(writeData);
        socket.emit("done", null);
      });
    });
  });
});

//webpage main
app.get("/main", function (req, res) {
  //simple copy

  var fiwareConfig = JSON.parse(JSON.stringify(config.orionCB));
  currentWatching.reqId = req.query.id;
  currentWatching.reqType = req.query.type;

  fiwareConfig.path = `/v2/entities?id=${currentWatching.reqId}&type=${currentWatching.reqType}`;
  console.log(fiwareConfig.path);
  fc.getFiware(fiwareConfig, function (fiwareData) {
    var useData = JSON.parse(fiwareData);

    res.render(__dirname + "/adminMain.pug", {
      data: JSON.stringify(useData),
    });
  });
  //using websocket
});

app.get("/chart", function (req, res) {
  var id = req.query.id;
  var type = req.query.type;
  var maximum = req.query.number;
  var interval = req.query.interval;
  if (maximum == undefined) maximum = 10;

  if (id == undefined || type == undefined) {
    res.status(400).send("no id/type specified");
  } else {
    sql.findItem(id, type, maximum, function (sqlData) {
      hi.parseLine(sqlData, function (chartData) {
        //console.log(chartData)
        //console.log(JSON.stringify(chartData))
        res.render(__dirname + "/chart.pug", {
          data: JSON.stringify(chartData),
        });
      });
      //chart에 맞게 변환
    });
  }
});

app.get("/table", function (req, res) {
  useDataTable(req, res);
});

function useDataTable(req, res) {
  var fiwareConfig = JSON.parse(JSON.stringify(config.orionCB));
  var reqType = req.query.type;
  if (reqType == null) fiwareConfig.path = "/v2/entities?options=keyValues";
  else fiwareConfig.path = "/v2/entities?options=keyValues&type=" + reqType;

  fc.getFiware(fiwareConfig, function (fiwareData) {
    var useData = JSON.parse(fiwareData);

    res.render(__dirname + "/DataTable.pug", {
      data: JSON.stringify(useData),
    });
  });
}

httpserver.listen(config.serverport, function () {
  console.log("localhost:" + config.serverport);
});

setInterval(function () {
  console.log("Interval work");
  var fiwareConfig = JSON.parse(JSON.stringify(config.orionCB));
  fiwareConfig.path = `/v2/entities`;

  fc.getFiware(fiwareConfig, function (fiwareData) {
    var useData = JSON.parse(fiwareData).filter((data) => data.type != "order");

    useData.forEach((ele) => {
      updateDB(ele);
    });

    latest = useData;
  });
}, 3000);

function updateDB(object) {
  var data = {
    id: object.id,
    type: object.type,
  };
  //console.log(object)
  object.history.value.forEach((ele) => {
    data[ele] = object[ele].value;
  });
  //console.log(data)
  sql.addItem(data);
}
