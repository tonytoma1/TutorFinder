const Account = require('../models/account');
const Chat = require('../models/chat');

/**
 * Saves an instant message that is being delivered between users. 
 * @param {String} recipientEmail - the email of the user that is receiving the message.
 * @param {String} senderEmail - the email of the user that is sending the message
 * @param {String} message - the message that is being sent
 * @returns boolean if the chat was saved or not.
 */
async function saveChatMessage(recipientEmail, senderEmail, message) {
    try {
        const recipientAccount = await Account.findOne({email: recipientEmail});
        const senderAccount = await Account.findOne({email: senderEmail});
        const chat = new Chat({
            fromUser: senderAccount.id,
            toUser: recipientAccount.id,
            message: message
        })
        await chat.save();
        return true;
    }
    catch(error) {
        return false;
    }
}

module.exports = {saveChatMessage}