const mongoose = require('mongoose');

// Define the schema for nominees
const nomineeSchema = new mongoose.Schema({
  nominee: { type: String, required: true },
  relation: { type: String, required: true }
});

// Define the main customer schema
const customerSchema = new mongoose.Schema({
  Date: { type: Date, default: Date.now },
  name: { type: String, required: true },
  spouse: { type: String },
  dob: { type: Date },
  age: { type: Number },
  gender: { type: String },
  address: { type: String }, 
  mobileNo: { type: String, required: true },
  email: { type: String },
  aadhaarNo: { type: String },
  panNo: { type: String },
  customerId: { type: String, required: true },
  idproof: { type: String },
  image: { type: String }, // Will store the image as a base64 string
  nominees: [nomineeSchema] // Embeds the nominees schema
});


module.exports = customerSchema;
