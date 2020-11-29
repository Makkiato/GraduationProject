const mqtt = require("mqtt");
const coap = require("coap");

var mqttMode = false;
var coapMode = false;

var mqttClient;
var coapClient;

function init(config, callback) {
  if (
    config == undefined ||
    (config.mqtt == undefined && config.coap == undefined)
  ) {
    console.error("no initilizing configuration");
    process.exit(1);
  } else {
    if (config.mqtt != undefined) {
      if (config.mqtt.broker == undefined) {
        console.error("no mqtt broker configuration");
        process.exit(1);
      } else {
        if (config.mqtt.broker.host == undefined) {
          console.error("no mqtt broker host configuration");
        }
        if (config.mqtt.broker.port == undefined) {
          config.mqtt.broker.port = 1883;
        }

        var registerOption = JSON.parse(JSON.stringify(config.mqtt));
        delete registerOption.broker;

        mqttClient = mqtt.connect(
          "mqtt://" + config.mqtt.broker.host + ":" + config.mqtt.broker.port,
          registerOption
        );

        mqttClient.on("connect", function () {
          mqttMode = true;
        });
        mqttClient.on("disconnect", function () {
          mqttMode = false;
        });
      }
    }
    if (config.coap != undefined) {
      if (config.coap.server == undefined) {
        console.error("no coap server configuration");
        process.exit(1);
      } else {
        if (config.coap.server.host == undefined) {
          console.error("no coap server host configuration");
        }
        if (config.coap.server.port == undefined) {
          config.coap.server.port = 5683;
        }

        var coapTiming = {
          ackTimeout: 0.25,
          ackRandomFactor: 1.0,
          maxRetransmit: 3,
          maxLatency: 2,
          piggybackReplyMs: 10,
        };
        coap.updateTiming(coapTiming);

        //여기부터

        mqttClient = mqtt.connect(
          "mqtt://" + config.mqtt.broker.host + ":" + config.mqtt.broker.port,
          registerOption
        );

        mqttClient.on("connect", function () {
          mqttMode = true;
        });
        mqttClient.on("disconnect", function () {
          mqttMode = false;
        });
      }
    }
  }
}
