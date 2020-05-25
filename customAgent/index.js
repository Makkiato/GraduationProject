const config = require("./config");
const broker = config.broker;
const orion = config.orionCB;
const agentInfo = config.agentInfo;

// consat coap = require('some coap module');
const mc = require("./mqttConnector");
const fc = require("./fiwareConnector");

var mqttList = {};

mc.init(broker, registerToFiware, reportToFiware, shutdownToFiware, function (
  client
) {
  console.log("mqtt connection established");
  console.log(client.name);
  mqttList[client.name] = client;

  loadOrder();
});
function loadOrder() {
  setInterval(function () {
    // every 3 seconds, check the order list
    var fiwareConfig = JSON.parse(JSON.stringify(orion));
    fiwareConfig.path = "v2/entities?agent=" + agentInfo.id + "&type=order";

    fc.getFiware(fiwareConfig, function (fiwareData) {
      console.log("order recieved");
      var parsedFD = JSON.parse(fiwareData);
      if (parsedFD.length == 0) {
        console.log("no new order");
      } else {
        console.log("new order");

        parsedFD.forEach((ele) => {
          if (ele.orionError == undefined) {
            var fiwareConfig = JSON.parse(JSON.stringify(orion));
            fiwareConfig.path = "v2/entities/" + ele.id + "?type=order";
            fc.deleteFiware(fiwareConfig, function (fiwareData) {
              console.log("order deleted");
            });
            //processing order here
            processMqttOrder(ele);
          } else {
            //console.log(parsedFD)
          }
        });
      }
    });
  }, 3000);
}

function processMqttOrder(parsed) {
  console.log("processing mqtt order");
  var group = parsed.group.value;
  var connection = mqttList[group];
  connection.publish("/order/" + parsed.id, JSON.stringify(parsed));
}

function registerToFiware(deviceData, connectionId) {
  // called in mqttConnector when device is registered
  var parsed = JSON.parse(deviceData);

  parsed.group = {};
  parsed.agent = {};
  parsed.group.value = connectionId;
  parsed.group.type = "string";
  parsed.agent.value = agentInfo.id;
  parsed.agent.type = "string";

  var fiwareConfig = JSON.parse(JSON.stringify(orion));
  fiwareConfig.path = "/v2/entities/";
  console.log("register new device into");

  fc.postFiware(fiwareConfig, parsed, function (fiwareData) {
    console.log(fiwareData);
  });
}

function shutdownToFiware(deviceId) {
  // called in mqttConnector when device shutdown
  console.log("shutdown detected : " + deviceId);
  var fiwareConfig = JSON.parse(JSON.stringify(orion));
  fiwareConfig.path = "/v2/entities/" + deviceId;

  fc.deleteFiware(fiwareConfig, function (fiwareData) {
    console.log(fiwareData);
  });
}

function reportToFiware(deviceData, connectionId) {
  // called in mqttConnector when device responsed about orders done
  var parsed = JSON.parse(deviceData);
  var fiwareConfig = JSON.parse(JSON.stringify(orion));
  fiwareConfig.path = "/v2/entities/" + parsed.id + "/attrs";
  delete parsed.id;
  delete parsed.type;
  parsed.group = {};
  parsed.agent = {};
  parsed.group.value = connectionId;
  parsed.group.type = "string";
  parsed.agent.value = agentInfo.id;
  parsed.agent.type = "string";
  
  
  fc.putFiware(fiwareConfig, parsed, function (fiwareData) {
    console.log(fiwareData);
  });
}
