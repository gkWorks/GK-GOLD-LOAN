const mongoose = require('mongoose');

// Define the schema for nominees
const nomineeSchema = new mongoose.Schema({
  nominee: { type: String},
  relation: { type: String}
});

// Define the main customer schema
const customerSchema = new mongoose.Schema({
  companyId: { type: String, required: true }, // Store companyId with each item
  customerId: { type: Number, required: true }, // Unique customerId
  Date: { type: Date, default: Date.now },
  name: { type: String, required: true},
  spouse: { type: String },
  dob: { type: Date },
  age: { type: Number },
  gender: { type: String },
  address: { type: String, required: true }, 
  mobileNo: { type: String },
  email: { type: String },
  aadhaarNo: { type: String },
  panNo: { type: String },
  idproof: { type: String },
  idNo: { type: String },
  image: { type: String }, // Will store the image as a base64 string
  nominees: [nomineeSchema] // Embeds the nominees schema
});

// Create a compound index on companyId and customerId
customerSchema.index({ companyId: 1, customerId: 1 }, { unique: true });

module.exports = customerSchema;
