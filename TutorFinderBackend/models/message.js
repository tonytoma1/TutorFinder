var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const message = new Schema({
    toUser: {type: Schema.Types.ObjectId, ref: 'Account', required: true},
    fromUser: {type: Schema.Types.ObjectId, ref: 'Account', required: true},
    message: {type: String, required: true},
    date: {type: Date, default: Date.now()}
})

module.exports = mongoose.model('Message', message);