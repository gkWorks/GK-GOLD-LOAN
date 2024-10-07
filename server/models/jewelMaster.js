const mongoose = require('mongoose');

const jewelMasterSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  companyId: { type: String, required: true }, // Store companyId with each item
  createdAt: { type: Date, default: Date.now }
});

module.exports = jewelMasterSchema; // Export the schema directly