const http = require("http");


function postFiware(orionCB, writeData, callback){
    orionCB.method = "POST";
    orionCB.headers = {
      "Content-Type": "application/json",
      "Content-Length": JSON.stringify(writeData).length,
    };
    connectFiware(orionCB,writeData,callback)
    
}
function getFiware(orionCB,callback){
    orionCB.method = "GET";
    orionCB.headers = {};
    connectFiware(orionCB,null,callback)
}
function putFiware(orionCB, writeData, callback){
    orionCB.method = "PUT";
    orionCB.headers = {
      "Content-Type": "application/json",
      "Content-Length": JSON.stringify(writeData).length,
    };
    connectFiware(orionCB,writeData,callback)
}
function deleteFiware(orionCB, callback){
    orionCB.method = "DELETE";
    orionCB.headers = {};
    connectFiware(orionCB,null,callback)
}

function connectFiware(orionCB,writeData,callback){
    const req = http.request(orionCB, function (res) {
      aggregate(res,callback)
    });
    req.on("error", (error) => {
      console.log("error on sending data to fiware");
      console.error(error);
    });
    //console.log(JSON.stringify(writeData))
    req.write(JSON.stringify(writeData));
    req.end();
}




function aggregate(response, callback) {
    console.log(`statusCode: ${response.statusCode}`);
    var CBdata = "";
    response.on("data", function (chunk) {
      CBdata += chunk;
    });
    response.on("end", function () {
      callback(CBdata);
    });
  }
  module.exports.deleteFiware = deleteFiware;
  module.exports.postFiware = postFiware;
  module.exports.getFiware = getFiware;
  module.exports.putFiware = putFiware;