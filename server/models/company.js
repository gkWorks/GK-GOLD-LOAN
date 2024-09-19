const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    
  branchId: String,
  branchName: String,
  branchContactPerson: String,
  branchContactNumber: String,
  branchAddress: String,
  branchAmc: String,
  branchStartDate: Date,
  branchUniqueId: String,
  branchUsername: String,
  branchPassword: String,
  
});

const companySchema = new mongoose.Schema({
  companyName: String,
  contactPerson: String,
  contactNumber: String,
  address: String,
  regNo: String,
  dateOfStart: Date,
  modeOfAmc: String,
  companyUsername: String,
  companyPassword: String,
 
  branches: [branchSchema],
});

const loginTimestampSchema = new mongoose.Schema({
  username: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  userType: { type: String, required: true },
  ipAddress: { type: String, required: true },
  deviceInfo: { type: String, required: true },
  latitude: Number,
  longitude: Number
});

const LoginTimestamp = mongoose.model('LoginTimestamp', loginTimestampSchema);

module.exports = {
    companySchema, LoginTimestamp 
  };
