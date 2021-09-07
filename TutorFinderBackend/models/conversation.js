var mongoose = require('mongoose');
const Schema = mongoose.Schema;


const conversation = new Schema({
    recipients: [{type: Schema.Types.ObjectId, ref: 'Account'}],
    messages: [{type: Schema.Types.ObjectId, ref: 'Message'}]
})

module.exports = mongoose.model('Conversation', conversation);