var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Errors = {
  'JSONSyntaxError': 'Message is not valid JSON.',
  'MissingTypeError': 'Message does not contain type.',
  'InvalidTypeError': 'Invalid type for message.',
  'MissingParameterError': 'Missing parameter for message type..'
};
Object.keys(Errors).forEach(function(errorName) {
  var tmpMessage = Errors[errorName];
  Errors[errorName] = function(message) {
    this.name = errorName;
    this.message = (message || tmpMessage);
  }
  Errors[errorName].prototype = Error.prototype;
});

var EventStreamParser = module.exports = function() {
  EventEmitter.call(this);  
};
util.inherits(EventStreamParser, EventEmitter);

EventStreamParser.Errors = Errors;

EventStreamParser.prototype.add = function(buf) {
  var json = null;
  var self = this;
  try {
    if(Buffer.isBuffer(buf)) {
      json = JSON.parse(buf.toString());  
    } else {
      json = JSON.parse(buf);  
    }
  } catch(e) {
    self.emit('error', new Errors.JSONSyntaxError(e.message), buf);
    return;
  }
  
  var res = this.validate(json);
  if (res === true) {
    this.emit(json.type, json);
  } else {
    this.emit('error', res, json);
  }
};

EventStreamParser.prototype.validate = function(json) {
  if (json.type === undefined) {
    return new Errors.MissingTypeError();
  }

  var properties = {
    'subscribe': { topic: 'string' },
    'unsubscribe': { subscriptionId: 'number' },
    'error': { code: 'number', timestamp: 'number', topic: 'string' },
    'subscribe-ack': { timestamp: 'number', subscriptionId: 'number', topic: 'string' },
    'unsubscribe-ack': { timestamp: 'number', subscriptionId: 'number' },
    'event': { topic: 'string', timestamp: 'number', subscriptionId: 'number'},
    'ping': {}, // optional data parameter can be sent
    'pong': {} // optional data parameter can be sent
  };

  var keys = properties[json.type];
  if (!keys) {
    return new Errors.InvalidTypeError();
  }

  var valid = Object.keys(keys).every(function(key) {
    return (typeof json[key] === keys[key]);
  });

  if (!valid) {
    return new Errors.MissingParameterError();
  } else {
    return true;
  }
};
