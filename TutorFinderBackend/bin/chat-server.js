const {getAllConversationsForUser, saveMessage} = require('../services/chat-service');
const Message = require('../models/message');

function chatServer(io) {
    io.on('connection', async (socket) => {
        // load the user's private message and send those private messages to the user.
        let conversations = await getAllConversationsForUser(socket.handshake.auth.username);
        socket.emit('conversations_list', conversations);
      
        socket.join(socket.handshake.auth.username);
      
        socket.on('message_sent', async (messageContent) => {
          // Persist message to the database
          let result = await saveMessage(messageContent.recipientEmail, messageContent.senderEmail, messageContent.message);
          // emit message to the other user
          let populatedChatMessage = await Message.findById(result.message.id).populate("fromUser").populate("toUser");
          // TODO send updated conversation list to both users.
          let recipientConversations = await getAllConversationsForUser(messageContent.recipientEmail);
          let senderConversations = await getAllConversationsForUser(messageContent.senderEmail);
          io.to(messageContent.recipientEmail).to(messageContent.senderEmail).emit("message_received", populatedChatMessage);
          io.to(messageContent.recipientEmail).emit("updated_conversations", recipientConversations)
          io.to(messageContent.senderEmail).emit("updated_conversations", senderConversations);
        })
        socket.on('disconnecting', () => {
          
        })
      
      })
}

module.exports = {chatServer}
