// models/jewelMaster.js

const mongoose = require('mongoose');

const jewelMasterSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  // Add more fields as necessary
  // Example:
  // purity: { type: String, required: true },
  // pricePerGram: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = jewelMasterSchema;
