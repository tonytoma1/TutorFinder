const Account = require('../models/account');
const Message = require('../models/message');
const Conversation = require('../models/conversation');
const mongoose = require('mongoose');

/**
 * Saves an instant message that is being delivered between users. 
 * @param {String} recipientId - the id of the user that is receiving the message.
 * @param {String} senderId - the id of the user that is sending the message
 * @param {String} message - the message that is being sent
 * @returns boolean and chat message object containing the message and if the message was successfully sent
 */
async function saveMessage(recipientId, senderId, message) {
    try {
        //const recipientAccount = await Account.findById(recipientId);
        //const senderAccount = await Account.findById(senderId);
        let conversation = await Conversation.findOne({recipients: {$all: [mongoose.Types.ObjectId(recipientId), 
                                                                          mongoose.Types.ObjectId(senderId)]}})
        
        // If the conversation doesn't exist then create it.
        if(conversation == null || conversation.length == 0) {
            let newConversation = new Conversation();
            newConversation.recipients.push(recipientId);
            newConversation.recipients.push(senderId);
            await newConversation.save();
            conversation = newConversation;
        }

        const chat = new Message({
            fromUser: senderId,
            toUser: recipientId,
            message: message
        })
        await chat.save();
        conversation.messages.push(chat.id);
        await conversation.save();
        return {messageSaved: true, message: chat};
    }
    catch(error) {
        return {messageSaved: false, message: null};
    }
}

/**
 * Gets all of the conversations that the user is in
 * @param {String} userId - the user's id.
 */
async function getAllConversationsForUser(userId) {
    let conversation = null;
    try {
        const account = await Account.findById(userId);
        conversation = await Conversation.find({recipients: {$in: [mongoose.Types.ObjectId(account.id)]}})
                                         .populate('recipients', '-password').populate({path: "messages",
                                                                                        populate: {
                                                                                            path: 'fromUser',
                                                                                            model: 'Account',
                                                                                            select: '-password'
                                                                                        }
                                                                                    })
                                                                                    .populate({path: 'messages', 
                                                                                              populate: {
                                                                                                  path: 'toUser',
                                                                                                  model: 'Account',
                                                                                                  select: '-password'
                                                                                              }});
    }
    catch(error) {

    }
    return conversation;
}




module.exports = {saveMessage, getAllConversationsForUser}