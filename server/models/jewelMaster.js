
const mongoose = require('mongoose');

const jewelMasterSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = jewelMasterSchema; // Export the schema directly