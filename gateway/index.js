const config = require("./config");
const randomString = require("randomstring");
const mc = require("./mqttConnector");
const cc = require("./coapConnector");
const ac = require("./agentConnector");

var connectorList = {};
var agent = undefined;
ac.init(config.agent, processOrder, function (agentClient) {
  agent = agentClient;
  mc.init(config.broker, register, report, shutdown, function (client) {
    do {
      client.name = randomString.generate();
    } while (connectorList.hasOwnProperty(client.name));
    console.log("mqtt connection established");
    //console.log(client.name);
    var object = {
      connection: client,
      type: "mqtt",
    };
    connectorList[client.name] = object;
    //console.log(client.deviceList)
    //loadOrder(client);
  });
  cc.init(register, report, shutdown, function (server) {
    do {
      server.name = randomString.generate();
    } while (connectorList.hasOwnProperty(server.name));
    console.log("mqtt connection established");

    var object = {
      connection: server,
      type: "coap",
    };
    connectorList[server.name] = object;
  });
});

function processOrder(parsed) {
  console.log("processing order");

  var group = parsed.group.value;
  var channel = connectorList[group];

  switch (channel.type) {
    case "mqtt":
      channel.connection.publish("/order/" + parsed.id, JSON.stringify(parsed));
      break;
    case "coap":
      channel.connection.orderList.push({
        id: parsed.id,
        type: parsed.type,
        order: parsed.order.value,
      });
      break;
  }
}

function register(deviceData, connectionId) {
  console.log(`register ${deviceData}`)
  var parsed = JSON.parse(deviceData);
  parsed.group = connectionId
  agent.emit('register', parsed)
}

function report(deviceData, connectionId) {
    var parsed = JSON.parse(deviceData);
    parsed.group = connectionId
    agent.emit('report', parsed)
}
function shutdown(deviceData, connectionId) {
    var parsed = deviceData[0];
    
    agent.emit('terminate', {id : parsed.id, type : parsed.type, group: connectionId})
}
