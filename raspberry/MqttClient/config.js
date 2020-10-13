var broker = {
  host: "localhost",
  port: "1884",
};

var deviceInfo = {
  id: "bedroomLED",
  type: "device",

  deviceType: {
    type: "device",
    value: "led",
  },

  state: {
    value: "OFF",
    type: "string",
    possible : 3
  },

  work: {
    value: ["turn on", "turn off"],
    type: "action",
  },

  history: {
    value: ["state", "humidity", "temperature"],
    type: "record",
  },
};
var registerOption = {
  will: {
    topic: "/terminate/" + deviceInfo.id,
    payload: JSON.stringify(deviceInfo),
  },
};

module.exports.broker = broker;
module.exports.deviceInfo = deviceInfo;
module.exports.registerOption = registerOption;

var test = {
  history: {
    type: "history",
    value: {
      type: "device",
      agent: {
        value: "agent1",
        type: "agent",
      },
      row: {
        name: "time",
        value: [
          "2020-08-15T13:22:56.934Z",
          "2020-08-15T13:22:59.933Z"         
        ],
      },
      column: {
        name: ["state", "humidity", "temperature"],
        value: [
          ["OFF", 14, 11],
          ["OFF", 27, 17]
        ],
      },
    },
  },
};
