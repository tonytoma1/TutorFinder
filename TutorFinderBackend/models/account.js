var mongoose = require('mongoose');
const Schema = mongoose.Schema;

//User Schema
const account = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    profilePicture: {type: String, default: null},
    accountType: {type: Schema.Types.ObjectId, required: true},
    onModel: {type: String, required: true, enum: ['Tutor', 'Student']}
});

module.exports = mongoose.model('Account', account);