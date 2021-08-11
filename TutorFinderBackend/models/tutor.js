var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tutor = new Schema({
    subjects: {type: [String], validate: v => Array.isArray(v) && v.length > 0},
    price: {type: Number, required: true},
    rating: {type: Number, default: 0}
})

module.exports = mongoose.model('Tutor', tutor);