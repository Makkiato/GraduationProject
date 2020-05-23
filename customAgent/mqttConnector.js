const mqtt = require('mqtt');




function init(broker,name,callback){
    
    var client = mqtt.connect("mqtt://" + broker.host + ":" + broker.port);
    client.name = name
    
    client.on("connect", function () {
        //excuted when connected
        console.log("successfully connected to : " + broker.host + ":" + broker.port)
        client.subscribe("/current/order", function (err) {
            if (!err) {
                // fiware reporting sequence
                console.log("waiting for current state order")
            } else{
                console.error(err)
            }
        });
        client.subscribe("/current/report", function (err) {
            if (!err) {
                // fiware reporting sequence
                console.log("waiting for current state report")
            } else{
                console.error(err)
            }
        });
        client.subscribe("/device/devices", function (err) {
            if (!err) {
                // fiware reporting sequence
                console.log("waiting for current state msg")
            } else{
                console.error(err)
            }
        });
        
        setInterval(function(){
            client.publish("/device/list","")
        },3000);
        
        
    });
    
        client.on("message", function (topic, message) {
        // message is Buffer
        //excuted everytime get message from the topic subscribed
        console.log(topic)
        if (topic == "/device/devices") {
            var strArr = message.toString().split(",");
            client.deviceList = strArr
            console.log(client.deviceList)
    
        }
        else if (topic.startsWith("/current")){
    
        }
            
        
    });
    callback(client)
}

module.exports.init = init
