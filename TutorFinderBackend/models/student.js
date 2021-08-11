const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const student = new Schema({
    subjects: {type: [String], validate: v => Array.isArray(v) && v.length > 0},
    rating: {type: Number, default: 0}
});

module.exports = mongoose.model('Student', student);