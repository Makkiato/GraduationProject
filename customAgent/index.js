const config = require("./config");
const broker = config.broker;
const orion = config.orionCB;
const agentInfo = config.agentInfo;
const randomString = require("randomstring");
const listenerIP = config.currentServer.ip;
const listnerPort = config.currentServer.port;


const mc = require("./mqttConnector");
const cc = require("./coapConnector");
const fc = require("./fiwareConnector");
const listener = require("./subListener");

var connectorList = {};
console.log(listenerIP)

listener.init(listnerPort, processOrder, function () {
  //console.log("listner on!")
  mc.init(
    broker,
    registerToFiware,
    reportToFiware,
    shutdownToFiware,
    regSub,
    delSub,
    function (client) {
      
      do {
        client.name = randomString.generate();
      } while (connectorList.hasOwnProperty(client.name))
      console.log("mqtt connection established");
      //console.log(client.name);
      var object = {
        connection: client,
        type : 'mqtt'
      }
      connectorList[client.name] = object;
      //console.log(client.deviceList)
      //loadOrder(client);
    }
  );
  cc.init(    
    registerToFiware,
    reportToFiware,
    shutdownToFiware,
    regSub,
    delSub,
    function (server) {
      do {
        server.name = randomString.generate();
      } while (connectorList.hasOwnProperty(server.name))
      console.log("mqtt connection established");
      
      var object = {
        connection: server,
        type : 'coap'
      }
      connectorList[server.name] = object;
      
    }
  );
});

function regSub(object, client) {
  var fiwareConfig = JSON.parse(JSON.stringify(orion));
  fiwareConfig.path = "/v2/subscriptions";
  var orderObj = JSON.parse(JSON.stringify(object));

  orderObj.group = {
    value: client.name,
    type: "string",
  };
  orderObj.agent = agentInfo;

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
  fc.postFiware(fiwareConfig, payload, function (fiwareData) {});
}

function delSub(object, client) {
  var fiwareConfig = JSON.parse(JSON.stringify(orion));

  //console.log(object.id)
  //console.log("vs")

  var index = listener.subList.findIndex(function (ele) {
    //console.log(ele.id)
    return ele.id == object.id;
  });
  var targetSub = listener.subList.splice(index, 1);
  //console.log(targetSub)
  fiwareConfig.path = "/v2/subscriptions/" + targetSub[0].subId;
  //console.log(targetSub[0].subId)
  fc.deleteFiware(fiwareConfig, function (fiwareData) {
    console.log(fiwareData);
  });
}
/*
function loadOrder(client) { 
  //deprecated

  setInterval(function () {
    console.log(client.deviceList)
    // every 3 seconds, check the order list
    var fiwareConfig = JSON.parse(JSON.stringify(orion));
    fiwareConfig.path = "/v2/entities?agent=" + agentInfo.id + "&type=order";

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
            fiwareConfig.path = "/v2/entities/" + ele.id + "?type=order";
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
*/
function processOrder(parsed) {
  console.log("processing mqtt order");

  var group = parsed.group.value;
  var channel = connectorList[group];

  switch (channel.type){
    case 'mqtt':
      channel.connection.publish("/order/" + parsed.id, JSON.stringify(parsed));
      break;
    case 'coap':
      channel.connection.orderList.push({
        id : parsed.id,
        type: parsed.type,
        order : parsed.order.value
      })
      break;

  }


  
}

function registerToFiware(deviceData, connectionId) {
  // called in mqttConnector when device is registered
  var parsed = JSON.parse(deviceData);

  parsed.group = {
    value: connectionId,
    type: "string",
  };
  parsed.agent = {
    value: agentInfo.id,
    type: "string",
  };
  parsed.order = {
    value: 'default',
    type: 'order'
  }

  var fiwareConfig = JSON.parse(JSON.stringify(orion));
  fiwareConfig.path = "/v2/entities";
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
  parsed.group = {
    value: connectionId,
    type: "string",
  };
  parsed.agent = {
    value: agentInfo.id,
    type: "string",
  };

  console.log(parsed);
  fc.putFiware(fiwareConfig, parsed, function (fiwareData) {
    console.log(fiwareData);
  });
}
