const config = require("./config.js");
const mqtt = require("mqtt");
const broker = config.broker;
const client = mqtt.connect("mqtt://" + broker.host + ":" + broker.port);

var deviceList = [];
var changeLog = {};
changeLog.add = [];
changeLog.delete = [];

console.log("device manager '" + config.name + "' initiate");

client.on("connect", function () {
  console.log("successfully connected to : " + broker.host + ":" + broker.port);
  client.subscribe("/device/register", function (err) {
    if (!err) {
      console.log("waiting for devices to register");
    } else {
      console.error(err);
    }
  });

  client.subscribe("/device/shutdown", function (err) {
    if (!err) {
      console.log("waiting for devices to make will msg");
    } else {
      console.error(err);
    }
  });

  client.subscribe("/order/devicelist", function (err) {
    if (!err) {
      console.log("waiting for agent to request deviceList");
    } else {
      console.error(err);
    }
  });
});

client.on("message", function (topic, message, packet) {
  // message is Buffer
  //excuted everytime get message from the topic subscribed

  if (topic == "/device/register") {
    console.log("new device register");
    var parsed = JSON.parse(message);
    deviceList.push(parsed.id);
    changeLog.add.push(parsed.id);
    console.log(parsed.id);
  } else if (topic == "/device/shutdown") {
    console.log("shutdown processing");
    var parsed = JSON.parse(message);
    console.log(parsed.id);
    var index = deviceList.findIndex(function (ele) {
      return ele == parsed.id;
    });
    deviceList.splice(index, 1);
    changeLog.delete.push(parsed.id);
  } else if (topic == "/order/devicelist") {
    console.log("agent requested devicelist");
    var msg = {};
    msg.list = deviceList;
    msg.changeLog = changeLog;
    msg.name = config.name;
    client.publish("/device/devices", JSON.stringify(msg));
    changeLog.add.length = 0;
    changeLog.delete.length = 0;
  }
});
