const server = require("http").createServer();
const io = require("socket.io")(server);


function init(callback) {
  
  io.on("connection", (client) => {
    //after py socket make request
    console.log("GPIO on");
    client.on("disconnect", () => {
      console.log("GPIO out");
    });
    
    setInterval(()=>{
      client.emit('order', {test : "data"});
    },500)
    

    callback(client);

    client.on('order', (data) => {console.log(data)})
  });
}

function deliverOrder(client, data) {
  client.emit("order", data);
}

server.listen(3000);
init(function () {
  
  console.log("server on")
})

module.exports.init = init;
module.exports.deliverOrder = deliverOrder;
