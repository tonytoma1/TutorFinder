var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chat = new Schema({
    toUser: {type: Schema.Types.ObjectId, ref: 'Account', required: true},
    fromUser: {type: Schema.Types.ObjectId, ref: 'Account', required: true},
    message: {type: String, required: true}
})

module.exports = mongoose.model('Chat', chat);