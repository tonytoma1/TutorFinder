const Account = require('../models/account');
const {saveMessage, getAllConversationsForUser} = require('../services/chat-service');
const Chat = require('../models/message');
var mongoose = require('mongoose');
require('dotenv').config()


beforeAll(() => {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      });
})

it('given a message sent to a user, saveChatMessage() should return true', async () => {
    let sender = await Account.findOne({email: 'registertutor1@example.com'});
    let recipient = await Account.findOne({email: 'registertutor2@example.com'});
    let message = "Hello World!";
    let result = await saveMessage(recipient.email, sender.email, message);
    expect(result).toBe(true);
}, 30000)

it("given a user's email, getAllConversationsForUser() should return conversation object", async () => {
    let email = "registertutor1@example.com";
    let result = await getAllConversationsForUser(email);
    expect(result.length).not.toBe(0);
})