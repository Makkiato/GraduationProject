const mqtt = require("mqtt");

function init(broker, fiwarePost, fiwarePut, fiwareDelete, callback) {
  
  var client = mqtt.connect("mqtt://" + broker.host + ":" + broker.port);
  // is will neccesary?
  var first = true
  
  client.on("connect", function () {
    //excuted when connected
    console.log(
      "successfully connected to : " + broker.host + ":" + broker.port
    );
    client.subscribe("/current/order", function (err) {
      if (!err) {
        // fiware reporting sequence
        console.log("waiting for current state order");
      } else {
        console.error(err);
      }
    });
    client.subscribe("/current/report", function (err) {
      if (!err) {
        // fiware reporting sequence
        console.log("waiting for current state report");
      } else {
        console.error(err);
      }
    });
    client.subscribe("/device/devices", function (err) {
      if (!err) {
        // fiware reporting sequence
        console.log("waiting for current state msg");
      } else {
        console.error(err);
      }
    });
    client.subscribe("/info/+/response", function (err) {
      if (!err) {
        // fiware reporting sequence
        console.log("waiting for info response");
      } else {
        console.error(err);
      }
    });
    client.subscribe("/order/+/response", function (err) {
      if (!err) {
        // fiware reporting sequence
        console.log("waiting for order response");
      } else {
        console.error(err);
      }
    });

    setInterval(function () {
      client.publish("/order/devicelist", "");
    }, 3000);
  });

  client.on("message", function (topic, message) {
    // message is Buffer
    //excuted everytime get message from the topic subscribed
    
    if (topic == "/device/devices") {
      var parsed = JSON.parse(message);
      var list = parsed.list;
      
      var change = parsed.changeLog;

      if (client.deviceList == null) {
        client.deviceList = list;
        if(first){
            first = false;
            client.name = parsed.name;           
            list.forEach((element) => {
                client.publish("/info/" + element, ""); // response with device infromation through topic "/info/deviceID/response"
              })
              
              callback(client);
        }
      } else {
        if (change.add.length > 0) {
          change.add.forEach((element) => {
            client.deviceList.push(element);
            client.publish("/info/" + element, ""); // response with device infromation through topic "/info/deviceID/response"
          });
        }
        if (change.delete.length > 0) {
          change.delete.forEach((element) => {
            var index = client.deviceList.findIndex(function (ele) {
              return ele == element;
            });
            var deviceId = client.deviceList.splice(index, 1);
            fiwareDelete(deviceId);
          });
        }
      }

     
    } else if (topic.startsWith("/info") && topic.endsWith("/response")) {
        
        fiwarePost(message, client.name);
        
    } else if (topic.startsWith("/order") && topic.endsWith("/response")) {
        fiwarePut(message, client.name);
    }
  });
  
}

module.exports.init = init;

