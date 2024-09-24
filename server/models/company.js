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


module.exports = {
    companySchema
  };
