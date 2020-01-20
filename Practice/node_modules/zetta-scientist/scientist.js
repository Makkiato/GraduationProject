var DefaultDeviceConfig = require('./default_device_config');

var config = exports.config = function(machine) {
  var propsToCheck = ['_registry', '_log', '_pubsub'];
  
  propsToCheck.forEach(function(k) {
    if (machine[k] === 'undefined') {
      throw new Error('Trying to initialize device without needed property set.');
    } 
  });

  var DeviceConfig = machine.DeviceConfig;
  if (DeviceConfig === undefined) {
    console.error('Deprecation Warning: Device driver using old version of zetta-device upgrade to >= v0.19.0');
    DeviceConfig = DefaultDeviceConfig;
  }
  
  var config = new DeviceConfig();  
  machine.init(config);
  return config;
};

exports.init = function(machine) {
  var cfg = config(machine);
  machine._generate(cfg);

  return machine;
}

exports.create = function(/* constructor, ...constructorArgs */) {
  var args = Array.prototype.slice.call(arguments);
  var constructor = args[0];
  var constructorArgs = args.length > 1 ? args.slice(1) : undefined;

  var machine;

  if (constructor.prototype) {
    machine = new (Function.prototype.bind.apply(constructor, [null].concat(constructorArgs)));
  } else if (constructor.init) {
    machine = constructor;
  }

  return machine;
};
