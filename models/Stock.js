const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  quantity: {
    type: Number,
    default: 0
  }
  // Ajoutez d'autres champs si nécessaire
});

module.exports = mongoose.model('Stock', stockSchema); 