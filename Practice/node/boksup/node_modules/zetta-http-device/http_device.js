var util = require('util');
var Device = require('zetta-device');

var HttpDevice = module.exports = function HttpDevice() {
  Device.call(this);
};
util.inherits(HttpDevice, Device);
