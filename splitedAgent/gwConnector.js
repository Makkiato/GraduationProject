const http = require("http");
const server = http.createServer();
const io = require("socket.io")(server);
const fc = require("./fiwareConnector");
const listener = require("./subListener");
const randomString = require("randomstring");

var connectors = {}

function init(orion, agentInfo,listenerIP,listnerPort,callback) {
  io.on("connection", (client) => {
    console.log('connected')
    do {
      io.name = randomString.generate();
    } while (connectors.hasOwnProperty(io.name))
    console.log(io.name)
    client.on('register', function (data) {
      console.log('register')
     // console.log(JSON.stringify(data))
      var parsed = data;

      parsed.agent = {
        value: agentInfo.id,
        type: "agent",
      };
      var subConfig = JSON.parse(JSON.stringify(orion));
      subConfig.path = "/v2/subscriptions/";
      var orderObj = JSON.parse(JSON.stringify(parsed));

      var payload = {
        subject: {
          entities: [orderObj],
          condition: {
            attrs: ["order"],
          },
        },
        notification: {
          http: {
            url: "http://" + listenerIP + ":" + listnerPort + "/recieve",
          },
          attrs: ["order", "group"],
        },
      };
      fc.postFiware(subConfig, payload, function (fiwareData) {});

      parsed.order = {
        value: "default",
        type: "order",
      };
      parsed.group = {
        value: parsed.group,
        type : 'group'
      }

      var fiwareConfig = JSON.parse(JSON.stringify(orion));
      fiwareConfig.path = "/v2/entities";
      //console.log("register new device into");
      //console.log(JSON.stringify(parsed))
      fc.postFiware(fiwareConfig, parsed, function (fiwareData) {
        
        console.log(fiwareData);
        connectors[parsed.id] = client  
        //console.log(client)
      });
    });
    client.on("terminate", function (data) {
      console.log('terminate')
      //console.log(data.id)
      //console.log(listener.subList)
      var subConfig = JSON.parse(JSON.stringify(orion));

      //console.log(object.id)
      //console.log("vs")

      var index = listener.subList.findIndex(function (ele) {
        //console.log(ele.id)
        return ele.id == data.id;
      });
      var targetSub = listener.subList.splice(index, 1);
      //console.log(targetSub)
      subConfig.path = "/v2/subscriptions/" + targetSub[0].subId;
      //console.log(targetSub[0].subId)
      fc.deleteFiware(subConfig, function (fiwareData) {
        console.log(fiwareData);
        
      });

      var parsed = data
      console.log("shutdown detected : " + parsed.id);
      var fiwareConfig = JSON.parse(JSON.stringify(orion));
      fiwareConfig.path = "/v2/entities/" + parsed.id;

      fc.deleteFiware(fiwareConfig, function (fiwareData) {
        console.log(fiwareData);
        delete connectors[parsed.id]
      });
    });
    client.on("report", function (data) {
      console.log('report')
      var parsed = data
      var fiwareConfig = JSON.parse(JSON.stringify(orion));
      fiwareConfig.path = "/v2/entities/" + parsed.id + "/attrs";
      delete parsed.id;
      delete parsed.type;
      parsed.group = {
        value: parsed.group,
        type : 'group'
      }
      parsed.agent = {
        value: agentInfo.id,
        type: "agent",
      };

      //console.log(parsed);
      fc.putFiware(fiwareConfig, parsed, function (fiwareData) {
        console.log(fiwareData);
      });
    });


    client.emit('devices',null)
    
  });
  io.listen(3000);
}
function emit(data){
  console.log(`emit ${JSON.stringify(data)}`)
  //console.log(connectors[data.id])
  var connector = connectors[data.id]
  connector.emit('order',data)
}
module.exports.init = init
module.exports.emit = emit
