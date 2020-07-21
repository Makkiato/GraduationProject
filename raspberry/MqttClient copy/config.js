var broker = {
  host: "localhost",
  port: "1884",
};

var deviceInfo = {
  id: "kitchenBell",
  type: "device",

  deviceType :{
    type : "device",
    value : "bell"
  },
  state: {
    value: "standBy",
    type: "string",
  },

  work: {
    value: ["Ring"],
    type: "action"
  }
};
var registerOption = {
  will: {
    topic : "/terminate/"+deviceInfo.id,
    payload: JSON.stringify(deviceInfo),
  },
};

module.exports.broker = broker;
module.exports.deviceInfo = deviceInfo;
module.exports.registerOption = registerOption;
