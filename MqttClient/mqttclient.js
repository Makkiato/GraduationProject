var mqtt = require("mqtt");
var broker = require("./config.js").broker;

var client = mqtt.connect("mqtt://" + broker.host + "/" + broker.port);

var count = 0;
client.on("connect", function () {
  client.subscribe("/selfecho/#", function (err) {
    if (!err) client.publish("/selfecho/count", count.toString());
  });
});

client.on("message", function (topic, message) {
  // message is Buffer

  if (topic == "/selfecho/count") {
    count++;
    if (count < 10) client.publish("/selfecho/count", count.toString());
  }
  console.log(message.toString())
});
