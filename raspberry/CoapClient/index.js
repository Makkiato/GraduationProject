const coap = require("coap");
const config = require("./config");
const server = coap.createServer();

var coapTiming = {
  ackTimeout: 0.25,
  ackRandomFactor: 1.0,
  maxRetransmit: 3,
  maxLatency: 2,
  piggybackReplyMs: 10,
};

var action = "default";
coap.updateTiming(coapTiming);

// the default CoAP port is 5683
function register(callback) {
  var connection = undefined;

  var target = JSON.parse(JSON.stringify(config.server));
  target.method = "POST";

  connection = coap.request(target);

  connection.write(JSON.stringify(config.deviceInfo));

  connection.on("timeout", function (err) {
    console.log(err);
    console.log("retrying register");
    register(callback);
  });

  connection.on("response", function (res) {
    //console.log(`response : ${JSON.stringify(res)}`);

    console.log("register success");

    callback();
  });
  connection.on("error", function (err) {});
  connection.end();
}
register(function () {
  //actions after connection
  console.log("set interval");
  setInterval(function () {
    console.log(`processing : ${action}`);
    switch (action) {
      case "default":
        break;
      case "turn on":
        config.deviceInfo.state.value = "ON";
        action = "default";
        break;
      case "turn off":
        config.deviceInfo.state.value = "OFF";
        action = "default";
        break;
      default:
        action = "default";
        break;
    }
    var target = JSON.parse(JSON.stringify(config.server));
    target.method = "PUT";

    var putReq = coap.request(target);

    putReq.on("response", function (res) {
      var msg = res.payload.toString("utf8");
      console.log(`msg len : ${msg.length}`)
      if (msg.length > 0) {
        var parsed = JSON.parse(msg);
        if (parsed.order != undefined) {
          action = parsed.order;
        }
        console.log(msg);
      }
    });

    putReq.write(JSON.stringify(config.deviceInfo));
    putReq.end();
  }, 3000);
});
//terminate

//info

//order
