const mongoose = require('mongoose');

let stuSchema = new mongoose.Schema({
    name: String,
    class: Number,
    num: Number
})

module.exports = mongoose.model('Student', stuSchema)