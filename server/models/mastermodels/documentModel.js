const mongoose = require('mongoose');

// Define the document schema
const documentSchema = new mongoose.Schema({
  documentName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});


module.exports = documentSchema;


