var broker = {
  host: "localhost",
  port: "1884",
};

var deviceInfo = {
  id: "bedroomLED",
  type: "led",

  state: {
    "value" : "off",
    "type" : "string"
  }
};
var registerOption = {
  will :{
    topic : "/device/shutdown",
    payload : JSON.stringify(deviceInfo)
  }
}

module.exports.broker = broker;
module.exports.deviceInfo = deviceInfo;
module.exports.registerOption = registerOption;
