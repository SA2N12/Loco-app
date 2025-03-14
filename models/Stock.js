//imports
const mongoose = require('mongoose');

//schema
const stockSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type : String,
        default: ''
    },
    quantity: {
        type: Number,
        default: 1
    }
});

//model
const Stock = mongoose.model('Stock', stockSchema);

//export
module.exports = Stock;