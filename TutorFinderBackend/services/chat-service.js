const Account = require('../models/account');
const Message = require('../models/message');
const Conversation = require('../models/conversation');
const mongoose = require('mongoose');

/**
 * Saves an instant message that is being delivered between users. 
 * @param {String} recipientEmail - the email of the user that is receiving the message.
 * @param {String} senderEmail - the email of the user that is sending the message
 * @param {String} message - the message that is being sent
 * @returns boolean if the chat was saved or not.
 */
async function saveMessage(recipientEmail, senderEmail, message) {
    try {
        const recipientAccount = await Account.findOne({email: recipientEmail});
        const senderAccount = await Account.findOne({email: senderEmail});
        let conversation = await Conversation.findOne({recipients: {$all: [mongoose.Types.ObjectId(recipientAccount.id), 
                                                                          mongoose.Types.ObjectId(senderAccount.id)]}})
        
        // If the conversation doesn't exist then create it.
        if(conversation == null || conversation.length == 0) {
            let newConversation = new Conversation();
            newConversation.recipients.push(recipientAccount.id);
            newConversation.recipients.push(senderAccount.id);
            await newConversation.save();
            conversation = newConversation;
        }

        const chat = new Message({
            fromUser: senderAccount.id,
            toUser: recipientAccount.id,
            message: message
        })
        await chat.save();
        conversation.messages.push(chat.id);
        await conversation.save();
        return true;
    }
    catch(error) {
        return false;
    }
}

/**
 * Gets all of the conversations that the user is in
 * @param {String} email - the user's email.
 */
async function getAllConversationsForUser(email) {
    let conversation = null;
    try {
        const account = await Account.findOne({email: email});
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