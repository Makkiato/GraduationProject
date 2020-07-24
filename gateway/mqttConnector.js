const mqtt = require("mqtt");

function init(broker, register, report, shutdown, callback) {
  var client = mqtt.connect("mqtt://" + broker.host + ":" + broker.port);
  // is will neccesary?

  client.deviceList = new Array();
  client.on("connect", function () {
    //excuted when connected
    console.log(
      "successfully connected to : " + broker.host + ":" + broker.port
    );
    client.subscribe("/terminate/+", function (err) {
      if (!err) {
        // fiware reporting sequence
        console.log("waiting for device termination msg");
      } else {
        console.error(err);
      }
    });
    
    client.subscribe("/register/+", function (err) {
      if (!err) {
        // fiware reporting sequence
        console.log("waiting for device register msg");
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

    client.publish("/order/devicelist", "");

    callback(client);
  });

  client.on("message", function (topic, message) {
    // message is Buffer
    //excuted everytime get message from the topic subscribed

    if (topic.startsWith("/register/")) {
      var parsed = JSON.parse(message)
      var object = {
        id: parsed.id,
        type : parsed.type
      }    
           
      console.log(object)
      /*
      var resultFind =client.deviceList.findIndex(
        function (ele) {
          return ele.id == object.id && ele.type == object.type;
        } 
      );
      console.log(resultFind);
      */
      if (
        client.deviceList.findIndex(
          function (ele) {
            return ele.id == object.id && ele.type == object.type;
          } 
        )== -1
      ) {
        client.deviceList.push(object);
        //console.log(client.deviceList);
        register(message, client.name);
        
      }
    } else if (topic.startsWith("/terminate/")) {
      var parsed = JSON.parse(message)
      console.log(parsed)
      var object = {
        id: parsed.id,
        type : parsed.type
      }
      var index = client.deviceList.findIndex(function (ele) {
        return ele.id == object.id && ele.type == object.type;
      });
      var deviceId = client.deviceList.splice(index, 1);
      console.log(client.deviceList);
      console.log(deviceId)
      shutdown(deviceId);
      
    } else if (topic.startsWith("/info") && topic.endsWith("/response")) {
      //maybe depreacated
      register(message, client.name);
    } else if (topic.startsWith("/order") && topic.endsWith("/response")) {
      report(message, client.name);
    }
  });
}

module.exports.init = init;
