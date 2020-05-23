var broker = {
  host: "localhost",
  port: "1884",
};

var deviceInfo = {
  id: "bedroomLED",
  type: "led",

  group: {
    value: "my_own",
    group: "none",
  },
  state: "off",
  order: "none",
};

module.exports.broker = broker;
module.exports.deviceInfo = deviceInfo;
