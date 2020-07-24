const config = require("./config");
const orion = config.orionCB;
const agentInfo = config.agentInfo;
const listenerIP = config.currentServer.ip;
const listenerPort = config.currentServer.port;

//const data = require("./data")
const fc = require("./fiwareConnector");
const gc = require("./gwConnector")
const listener = require("./subListener");

listener.init(listenerPort, processOrder, function () {
    //console.log("listner on!")
    gc.init(orion,agentInfo,listenerIP,listenerPort)
  });

function processOrder (data){
  gc.emit(data)
}