const mqtt = require("mqtt");
const config = require("./config");
const ot = require('./orderTransfer')
const broker = config.broker;
const client = mqtt.connect(
  "mqtt://" + broker.host + ":" + broker.port,
  config.registerOption
);
const execa = require("execa");

ot.init( (pycon) =>{
  
})
const realConnect = false

var deviceInfo = config.deviceInfo;

var count = 0;

var action = "default";

client.on("connect", function () {
  //excuted when connected
  client.subscribe("/order/devicelist", function (err) {});
  client.subscribe("/order/" + deviceInfo.id, function (err) {});
  client.subscribe("/info/" + deviceInfo.id, function (err) {});
  console.log(JSON.stringify(deviceInfo));

  var sendMSG = JSON.parse(JSON.stringify(deviceInfo))
  sendMSG.temperature ={
    value : Math.floor((Math.random() * 10)+10),
    type : 'Numeric'
  }

  sendMSG.humidity ={
    value : Math.floor((Math.random() * 30)+10),
    type : 'Numeric'
  }

  client.publish("/register/" + deviceInfo.id, JSON.stringify(sendMSG));

  setInterval(function () {
    console.log(`processing : ${action}`);
    switch (action) {
      case "default":
        break;
      case "turn on":
        config.deviceInfo.state.value = "ON";
        break;
      case "turn off":
        config.deviceInfo.state.value = "OFF";
        break;
      default:
        action = "default";
        break;
    }
    var sendMSG = JSON.parse(JSON.stringify(deviceInfo))
    if(realConnect){
      
    } else {
      
      sendMSG.temperature ={
        value : Math.floor((Math.random() * 10)+10),
        type : 'Numeric'
      }
  
      sendMSG.humidity ={
        value : Math.floor((Math.random() * 30)+10),
        type : 'Numeric'
      }
    }
    client.publish(
      "/order/" + deviceInfo.id + "/response",
      JSON.stringify(sendMSG)
    );
  }, 3000);
});

client.on("message", function (topic, message) {
  // message is Buffer
  //excuted everytime get message from the topic subscribed

  if (topic == "/order/" + deviceInfo.id) {
    console.log("order recieved");
    var parsed = JSON.parse(message);
    console.log(parsed)
    //proccess order here
    action = parsed.order.value;
  } else if (topic == "/info/" + deviceInfo.id) {
    console.log("info request recieved");

    var sendMSG = JSON.parse(JSON.stringify(deviceInfo))
    sendMSG.temperature ={
      value : Math.floor((Math.random() * 10)+10),
      type : 'Numeric'
    }

    sendMSG.humidity ={
      value : Math.floor((Math.random() * 30)+10),
      type : 'Numeric'
    }

    client.publish(
      "/info/" + deviceInfo.id + "/response",
      JSON.stringify(sendMSG)
    );
  } else if (topic == "/order/devicelist") {
    console.log("devicelist request recieved");

    var sendMSG = JSON.parse(JSON.stringify(deviceInfo))
    sendMSG.temperature ={
      value : Math.floor((Math.random() * 10)+10),
      type : 'Numeric'
    }

    sendMSG.humidity ={
      value : Math.floor((Math.random() * 30)+10),
      type : 'Numeric'
    }

    client.publish("/register/" + deviceInfo.id, JSON.stringify(sendMSG));
  }
});

