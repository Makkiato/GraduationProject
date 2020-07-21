const coap = require("coap");

function init(fiwarePost, fiwarePut, fiwareDelete,regSub,delSub, callback) {
  // the default CoAP port is 5683
  const server = coap.createServer();
  
  server.deviceList = new Array();
  server.orderList = new Array();
  server.lastCon = {};
  
  server.on("request", function (req, res) {
    console.log(req.payload.toString("utf8"));

    switch (req.method) {
      case "POST":
        var parsed = JSON.parse(req.payload.toString("utf8"));
        if (parsed.id == undefined || parsed.type == undefined) {
          res.statusCode = "4.00";
          res.end("id and type must be noted in payload");
        } else {
          var object = {
            id: parsed.id,
            type: parsed.type,
          };
          server.lastCon[parsed.id] = new Date().getTime()
          if (
            server.deviceList.findIndex(function (ele) {
              return ele.id == object.id && ele.type == object.type;
            }) == -1
          ) {
            server.deviceList.push(object);
            res.statusCode = "2.00";
            res.end();
            //console.log(client.deviceList);

            fiwarePost(JSON.stringify(parsed), server.name);
            regSub(object,server)
            console.log(`register ${object}`);
            console.log(`result : ${server.deviceList}`);
          }
          else{
              res.statusCode = "4.00"
              res.end("already exists")
          }
        }
        break;
      case "PUT":
        var parsed = JSON.parse(req.payload.toString("utf8"));
        console.log(parsed)
        if (parsed.id == undefined || parsed.type == undefined) {
          res.statusCode = "4.00";
          res.end("id and type must be noted in payload");
        } else {
          server.lastCon[parsed.id] = new Date().getTime()
          var orderIdx = server.orderList.findIndex(function (ele) {
            return ele.id == parsed.id && ele.type == parsed.type;
          });
          if (orderIdx != -1) {
            var order = server.orderList.splice(object, 1);
            res.statusCode = "2.00";
            res.end(JSON.stringify(order[0]));
            
            console.log(`register ${object}`);
            console.log(`result : ${server.deviceList}`);
          } else {
            res.statusCode = "2.00";
            res.end();
          }

          fiwarePut(JSON.stringify(parsed), server.name);
          console.log(`modify and check order of ${parsed.id}`);
          console.log(`result : ${server.deviceList}`);
        }
        break;
      
    }    
  });

  function deleteObject(id){    
    var index = server.deviceList.findIndex(function (ele) {
      return ele.id == id;
    });
    var object = server.deviceList.splice(index, 1);
    //console.log(client.deviceList);
    console.log(object);
    fiwareDelete(object[0].id);
    delSub(object,server)
    console.log(`remove ${id}`);
    console.log(`result : ${server.deviceList}`);
  }

  server.listen(function () {
    
    console.log("coap server on");
    setInterval(function(){
      console.log('checking deadman')
      var now = new Date().getTime()
      for(id in server.lastCon){
        var time = server.lastCon[id]
        console.log(`now : ${now}, time : ${time}, gap : ${now-time}`)
        if(now-time > 20000){
          //consider it as dead
          console.log(`${id} is dead`)
          delete server.lastCon[id]
          deleteObject(id)
        }
      }
    },5000)
    callback(server);
  });

  
}

module.exports.init = init;

