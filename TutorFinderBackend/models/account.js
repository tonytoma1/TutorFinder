var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {isEmail} = require('validator')

//User Schema
const account = new Schema({
    email: {type: String, required: true, unique: true, validate: [isEmail, 'invalid email']},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    passwordPin: {type: String, default: null},
    profilePicture: {type: String, default: 'https://res.cloudinary.com/realtor/image/upload/v1627443134/default_profile_image_nfw9mt.jpg'},
    accountType: {type: Schema.Types.ObjectId, required: true, refPath: 'onModel'},
    onModel: {type: String, required: true, enum: ['Tutor', 'Student']},
    firebaseToken: {type: String, default: null}
});

module.exports = mongoose.model('Account', account);