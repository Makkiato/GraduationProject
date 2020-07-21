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
  client.publish("/register/" + deviceInfo.id, JSON.stringify(deviceInfo));

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
    client.publish(
      "/order/" + deviceInfo.id + "/response",
      JSON.stringify(deviceInfo)
    );
  }, 3000);
});

client.on("message", function (topic, message) {
  // message is Buffer
  //excuted everytime get message from the topic subscribed

  if (topic == "/order/" + deviceInfo.id) {
    console.log("order recieved");
    var parsed = JSON.parse(message);
    //proccess order here
    action = parsed.order.value;
  } else if (topic == "/info/" + deviceInfo.id) {
    console.log("info request recieved");

    client.publish(
      "/info/" + deviceInfo.id + "/response",
      JSON.stringify(deviceInfo)
    );
  } else if (topic == "/order/devicelist") {
    console.log("devicelist request recieved");

    client.publish("/register/" + deviceInfo.id, JSON.stringify(deviceInfo));
  }
});

/*
test = execa("python",[__dirname+"/../SensorControl/LightSensorRead.py"])
test.stdout.pipe(process.stdout);
(async () => {
  const {stdout} = await test;
  console.log('child output:', stdout);
})();*/
