const mqtt = require("mqtt");
const broker = require("./config.js").broker;
const client = mqtt.connect("mqtt://" + broker.host + ":" + broker.port);
const execa = require('execa');

var count = 0;

client.on("connect", function () {
    //excuted when connected
  client.subscribe("/selfecho/#", function (err) {
    if (!err) client.publish("/selfecho/count", count.toString());
  });
  client.subscribe("/device/#", function (err) {});
  client.subscribe("/other/#", function (err) {});
  client.subscribe("/mymind/#", function (err) {});
});

client.on("message", function (topic, message) {
  // message is Buffer
  //excuted everytime get message from the topic subscribed
  console.log(topic)
  if (topic == "/selfecho/count") {
    count++;
    if (count < 10) client.publish("/selfecho/count", count.toString());
  }
  else if (topic.startsWith("/device/echo")){
      var parsed = JSON.parse(message)
      var JSONstring = '{ "echo" : "' + parsed.id + '"}'
      client.publish("/device/reply/"+parsed.id,JSONstring)
  }
  else if (topic.startsWith("/mymind")){
    execa('omxplayer',['./sounds/firealarm.m4a']).stdout.pipe(process.stdout)
    
  }
  
  console.log(message.toString())
});
