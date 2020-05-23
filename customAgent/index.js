const broker = require("./config").broker;


// consat coap = require('some coap module');
const mc = require("./mqttConnector");
const fc = require("./fiwareConnector");


var mqttList = {}

mc.init(broker,"test" ,function(client){
    console.log("mqtt connection established");
    mqttList.test = client;
    
});