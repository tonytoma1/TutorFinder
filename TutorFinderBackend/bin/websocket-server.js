const {WebSocketServer} = require("ws");
const { createClient } = require('redis');
const {RedisBuilder} = require("../builders/redis-builder");

function webSocketServer(server) {
    const webSocketServer = new WebSocketServer({server: server})

    webSocketServer.on('connection', async (socket, request) => {
      // get url parameters
      const urlSearchParams = new URLSearchParams(request.url);
      const userId = urlSearchParams.get("/?id");
      const redisChannel = "user:" + userId;
      console.log(redisChannel);
      
      // Setup Redis connection
      let redis = await RedisBuilder.build(); // default connection to localhost
      redis.getRedisClient().on('error', (err) => console.log('Redis Client Error', err));
      redis.getSubscriber().subscribe(redisChannel, (message) => {
        console.log(message);
      });

      socket.on("message", async (input) => {
        let message = JSON.parse(input);
        switch(message.type) {
          case "LOGIN":
            // set up redis connection
            //connects to localhost on port 6379. 
        
            break;
          default:
            break;
        }
      })


    })
    
    webSocketServer.on("error", (err) => {
      console.log(err);
    })
}


module.exports = {webSocketServer}