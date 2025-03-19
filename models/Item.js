//imports
const mongoose = require('mongoose');

//schema
const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

//model
module.exports = mongoose.model('Item', ItemSchema);