const mqtt = require("mqtt");

function init(broker, fiwarePost, fiwarePut, fiwareDelete, callback) {
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
      var id = topic.split("/")[2];
      console.log(id)
      var resultFind =client.deviceList.findIndex(
        function (ele) {
          return ele == id;
        } 
      );
      console.log(resultFind);
      if (
        client.deviceList.findIndex(
          function (ele) {
            return ele == id;
          } 
        )== -1
      ) {
        client.deviceList.push(id);
        console.log(client.deviceList);
        fiwarePost(message, client.name);
      }
    } else if (topic.startsWith("/terminate/")) {
      var id = topic.split("/")[2];
      var index = client.deviceList.findIndex(function (ele) {
        return ele == id;
      });
      var deviceId = client.deviceList.splice(index, 1);
      console.log(client.deviceList);
      fiwareDelete(deviceId);
    } else if (topic.startsWith("/info") && topic.endsWith("/response")) {
      fiwarePost(message, client.name);
    } else if (topic.startsWith("/order") && topic.endsWith("/response")) {
      fiwarePut(message, client.name);
    }
  });
}

module.exports.init = init;
