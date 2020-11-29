var server = {
    host : "127.0.0.1",
    port : "5683",
    
}


var deviceInfo = {
    id: "HYUEntranceMetro2ndExit_CoAP",
    type: "device",
  
    deviceType :{
      type : "device",
      value : "FireBreak"
    },
  
    state: {
      value : "Deactivated",
      type : "string"
    },
  
    work: {
      value: ["activate","deactivate"],
      type: "action"
    },
    history: {
      value: ["state"],
      type: "record",
    },
  };

  module.exports.deviceInfo = deviceInfo;
  module.exports.server = server