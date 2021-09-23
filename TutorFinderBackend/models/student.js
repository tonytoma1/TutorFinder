const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const student = new Schema({
    rating: {type: Number, default: 0}
});

module.exports = mongoose.model('Student', student);