var server = {
    host : "127.0.0.1",
    port : "5683",
    
}


var deviceInfo = {
    id: "ParkinglotRoadblock_CoAP",
    type: "device",
  
    deviceType :{
      type : "device",
      value : "traffic"
    },
  
    state: {
      value : "automated",
      type : "string"
    },
  
    work: {
      value: ["block","open","warning","automated"],
      type: "action"
    },

    pass : {
      type : "Numeric",
      value : 0
    },

    lastPass :{
      type : "String",
      value : "HYUCAR"
    },

    history: {
      value: ["pass","lastPass"],
      type: "record",
    },
  };

  module.exports.deviceInfo = deviceInfo;
  module.exports.server = server