const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  Date: { type: Date },
  name: { type: String, required: true },
  spouse: { type: String },
  dob: { type: Date, required: true },
  age: { type: Number },
  gender: { type: String },
  address: { type: String },
  mobileNo: { type: String, required: true },
  email: { type: String, required: true },
  idproof: { type: String },
  aadhaarNo: { type: String },
  panNo: { type: String },
  customerId: { type: String },
  nominee: { type: String },
  relation: { type: String },
  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
