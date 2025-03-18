//imports
const mongoose = require('mongoose');

//schema
const listSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }],
    description: {
        type : String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//model
const List = mongoose.model('List', listSchema);

//export
module.exports = List;