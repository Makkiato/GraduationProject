const mqtt = require("mqtt");
const config = require("./config")
const broker = config.broker;
const client = mqtt.connect("mqtt://" + broker.host + ":" + broker.port,config.registerOption);
const execa = require('execa');
var deviceInfo = config.deviceInfo

var count = 0;

client.on("connect", function () {
    //excuted when connected
  client.subscribe("/order/"+deviceInfo.id,function(err){});
  client.subscribe("/info/"+deviceInfo.id,function(err){});
  console.log(JSON.stringify(deviceInfo))
  client.publish("/device/register",JSON.stringify(deviceInfo))
  
});

client.on("message", function (topic, message) {
  // message is Buffer
  //excuted everytime get message from the topic subscribed
  if(topic == "/order/"+deviceInfo.id){
    console.log("order recieved")
    console.log(JSON.parse(message).order.value)
    //proccess order here

    client.publish("/order/"+deviceInfo.id+"/response",JSON.stringify(deviceInfo))
  } else if(topic == "/info/"+deviceInfo.id){
    console.log("info request recieved")
    client.publish("/info/"+deviceInfo.id+"/response",JSON.stringify(deviceInfo))
  }
  else if (topic.startsWith("/mymind")){
    execa('omxplayer',['./sounds/firealarm.m4a']).stdout.pipe(process.stdout)
    
  }
  
  
});
