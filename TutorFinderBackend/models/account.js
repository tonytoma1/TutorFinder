var mongoose = require('mongoose');
const Schema = mongoose.Schema;

//User Schema
const account = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    profile_picture: {type: String, default: null},
    account_type: {type: Schema.Types.ObjectId, required: true},
    onModel: {type: String, required: true, enum: ['Tutor', 'Student']}
});

module.exports = mongoose.model('Account', account);