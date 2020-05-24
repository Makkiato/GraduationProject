var broker = {
    host : "127.0.0.1",
    port : "1884"
};

var orionCB = {
    host : "127.0.0.1",
    port : "1026"
}

var coap = {
    host : "127.0.0.1",
    port : "5683"
}

var agentInfo = {
    id: "agent1",
    type: "agent"
}

module.exports.coap = coap;
module.exports.broker = broker;
module.exports.orionCB = orionCB;
module.exports.agentInfo = agentInfo;