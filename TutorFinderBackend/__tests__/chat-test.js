const Account = require('../models/account');
const Tutor = require('../models/tutor');
const Student = require("../models/student");
const {saveMessage, getAllConversationsForUser} = require('../services/chat-service');
const {createStudentAccount, createTutorAccount} = require('../services/account-service')
const Chat = require('../models/message');
var mongoose = require('mongoose');
require('dotenv').config()


describe("chat functionality", () => {
    const emailStudent = "chat.student@example.com";
    const emailTutor = "chat.tutor@example.com";
    beforeAll(async () => {
        mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });

        await Account.deleteMany({});
        await Student.deleteMany({});
        await Tutor.deleteMany({});

        const subjects = ["math", "science"];
        await createStudentAccount(emailStudent, "password", "Todd", "Jones");
        await createTutorAccount(emailTutor, "password", "John",
            "Doe", subjects, "20", "Accountant")

    })

    it('given a message sent to a user, saveChatMessage() should return true', async () => {
        let sender = await Account.findOne({ email: emailStudent });
        let recipient = await Account.findOne({ email: emailTutor });
        let message = "Hello World!";
        let result = await saveMessage(recipient.id, sender.id, message);
        expect(result.messageSaved).toBe(true);
    }, 30000)

    it("given a user's email, getAllConversationsForUser() should return conversation object", async () => {
        let account = await Account.findOne({email: emailStudent});
        let result = await getAllConversationsForUser(account._id);
        expect(result.length).not.toBe(0);
    })
})



