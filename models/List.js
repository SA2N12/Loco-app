const mongoose = require('mongoose');

const ListItemSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  listQuantity: { type: Number, required: true, default: 1 }
});

const ListSchema = new mongoose.Schema({
  name: String,
  description: String,
  items: [ListItemSchema]
});

module.exports = mongoose.model('List', ListSchema);