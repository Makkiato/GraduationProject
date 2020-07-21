var server = {
    host : "127.0.0.1",
    port : "5683",
    
}


var deviceInfo = {
    id: "CoAProomLED",
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
    }
  };

  module.exports.deviceInfo = deviceInfo;
  module.exports.server = server