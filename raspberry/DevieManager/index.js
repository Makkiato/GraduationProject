const mqtt = require('mqtt');
const broker = require("./config.js").broker;
const client = mqtt.connect("mqtt://" + broker.host + ":" + broker.port);

var deviceList = ["test1","test2","test3"]

client.on("connect", function () {
    //excuted when connected
    console.log("successfully connected to : " + broker.host + ":" + broker.port)
    client.subscribe("/device/register", function (err) {
        if (!err) {
            // fiware reporting sequence
            console.log("waiting for devices to register")
        } else{
            console.error(err)
        }
    });
        
    client.subscribe("/device/shutdown", function (err) {
        if (!err) {
            // fiware reporting sequence
            console.log("waiting for devices to make will msg")
        } else{
            console.error(err)
        }
    });

    client.subscribe("/device/list",function(err){
        if (!err) {
            // fiware reporting sequence
            console.log("waiting for agent to request deviceList")
        } else{
            console.error(err)
        }
    })
});

client.on("message", function (topic, message) {
  // message is Buffer
  //excuted everytime get message from the topic subscribed
  
    if (topic == "/device/register") {
        var parsed = JSON.parse(message)
        deviceList.push(parsed.id);

    }
    else if (topic == "/device/shutdown"){
        var parsed = JSON.parse(message)
        var index = deviceList.findIndex(function(ele){
            return ele == parsed;
        })
        deviceList.splice(index,1);
    }
    else if (topic == "/device/list"){
        client.publish("/device/devices",deviceList.toString())
    }
    
    console.log(message.toString())
});