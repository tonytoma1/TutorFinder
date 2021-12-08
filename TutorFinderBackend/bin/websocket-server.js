const {WebSocketServer} = require("ws");
const { createClient } = require('redis');
const {RedisBuilder} = require("../builders/redis-builder");
const {CONVERSATIONS_LIST} = require("../constants/websocket-constants");
const {getAllConversationsForUser, saveMessage} = require('../services/chat-service');

function webSocketServer(server) {
    const webSocketServer = new WebSocketServer({server: server})
    const socketMap = new Map();
    // TODO during a disconnect event, try to reconnect to server.
    
    webSocketServer.on('connection', async (socket, request) => {
      // get url parameters
      const urlSearchParams = new URLSearchParams(request.url);
      const userId = urlSearchParams.get("/?id");
      const redisChannel = "user:" + userId;
      socketMap.set(userId, socket);

      // Setup Redis connection
      let redis = await RedisBuilder.build(); // default connection to localhost
      redis.getRedisClient().on('error', (err) => console.log('Redis Client Error', err));
      redis.getSubscriber().subscribe(redisChannel, (message) => {
        console.log(message);
      });

      // load the user's initial conversation list
      let conversations =  await getAllConversationsForUser(userId);
      let convoData = JSON.stringify({type: CONVERSATIONS_LIST, data: conversations });
      socket.send(convoData);

      socket.on("message", async (input) => {
        let message = JSON.parse(input);
        switch(message.type) {
          case "CHAT":
            
        
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