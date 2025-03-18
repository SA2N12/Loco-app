//imports
const mongoose = require('mongoose');

//schema
const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    isStacked: { type: Boolean, default: false },
    quantity: { type: Number, default: 1 },
});

//model
const Item = mongoose.model('Item', ItemSchema);

//export
module.exports = Item;