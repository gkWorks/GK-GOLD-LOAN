const mongoose = require('mongoose');

// Define the document schema
const documentSchema = new mongoose.Schema({
  documentName: { type: String, required: true },
  companyId: { type: String, required: true }, // Add companyId to the schema
  createdAt: { type: Date, default: Date.now },
});

module.exports = documentSchema;
