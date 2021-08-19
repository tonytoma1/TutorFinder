var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tutor = new Schema({
    subjects: {type: [String], validate: v => Array.isArray(v) && v.length > 0},
    jobTitle: {type: String, default: null},
    description: {type: String, default: null},
    price: {type: Number, required: true},
    rating: {type: Number, default: 0}
})

module.exports = mongoose.model('Tutor', tutor);