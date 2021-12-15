const {WebSocketServer} = require("ws");
const { createClient } = require('redis');
const {RedisBuilder} = require("../builders/redis-builder");
const {CONVERSATIONS_LIST, PRIVATE_MESSAGE} = require("../constants/websocket-constants");
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
      if(redis != null) {
        redis.getRedisClient().on('error', (err) => console.log('Redis Client Error', err));
        redis.getSubscriber().subscribe(redisChannel, (message) => {
          // send message to the recipient in the message content
          let content = JSON.parse(message);
          let socket = socketMap.get(content.data.recipientId);
          socket.send(message);
        });
      }
      else {
        // TODO attempt to keep connecting to redis.
      }

      socket.on("message", async (input) => {
        let message = JSON.parse(input);
        switch(message.type) {
          case PRIVATE_MESSAGE:
              // Send a private message to another user
              let recipientChannel = "user:" + message.data.recipientId;
              let savedMessage = await saveMessage(message.data.recipientId, message.data.senderId, message.data.message);
              message.date = savedMessage.message.date;
              message._id = savedMessage.message.id;
              redis.getRedisClient().publish(recipientChannel, JSON.stringify(message))
            break;
          case CONVERSATIONS_LIST:
            let conversations =  await getAllConversationsForUser(userId);
            let convoData = JSON.stringify({type: CONVERSATIONS_LIST, data: conversations });
            socket.send(convoData);
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