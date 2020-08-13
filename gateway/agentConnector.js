function init(agent,processOrder,callback) {
  const socket = require("socket.io-client")(
    "http://" + agent.host + ":" + agent.port
  );
  socket.on("connect",function(){
      socket.on('order',function(data){
          /*
            data :{ id, type, order}
          */
         processOrder(data)
      })


      callback(socket)
  });

  
}

module.exports.init = init