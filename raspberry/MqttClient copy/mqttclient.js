const mqtt = require("mqtt");
const config = require("./config");
const broker = config.broker;
const client = mqtt.connect(
  "mqtt://" + broker.host + ":" + broker.port,
  config.registerOption
);
const execa = require("execa");
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
        deviceInfo.state.value = "standBy"
        break
      case "Ring":
        if (deviceInfo.state.value == "standBy") {
          deviceInfo.state.value = "Ringing";
          console.log("bell ringing");
          // naive implement
          setTimeout(function () {
            deviceInfo.state.value = "standBy";
            console.log("Ringing finished");
            action="default"
            client.publish(
              "/order/" + deviceInfo.id + "/response",
              JSON.stringify(deviceInfo)
            );
          },9000);
        }
        break
    }

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
  } else if (topic.startsWith("/mymind")) {
    execa("omxplayer", ["./sounds/firealarm.m4a"]).stdout.pipe(process.stdout);
  }
});
/*
test = execa("python",[__dirname+"/../SensorControl/LightSensorRead.py"])
test.stdout.pipe(process.stdout);
(async () => {
  const {stdout} = await test;
  console.log('child output:', stdout);
})();*/
