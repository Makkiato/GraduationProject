var broker = {
  host: "localhost",
  port: "1884",
};

var deviceInfo = {
  id: "bedroomLED",
  type: "device",

  deviceType :{
    type : "device",
    value : "led"
  },

  state: {
    value : "OFF",
    type : "string"
  },

  work: {
    value: ["turn on","turn off"],
    type: "action"
  },

  history: {
    value: ['state','humidity','temperature'],
    type : 'record'
  }
};
var registerOption = {
  will :{
    topic : "/terminate/"+deviceInfo.id,
    payload : JSON.stringify(deviceInfo)
  }
}

module.exports.broker = broker;
module.exports.deviceInfo = deviceInfo;
module.exports.registerOption = registerOption;
