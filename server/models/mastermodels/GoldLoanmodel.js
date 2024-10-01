// models/GoldLoan.js
const mongoose = require('mongoose');

const GoldLoanSchema = new mongoose.Schema({
  loanName: { type: String },
  interestRate: { type: Number }, // Set interestRate as required here
  interestslabs: [
    {
     
      slabImplementationDate: { type: String },
      from: { type: String, required: true },
      to: { type: String, required: true },
      interestRate: { type: Number} // Added interestRate inside slabs
    }
  ],
  slabImplementationDate: [{ type: String }],
  dates: { type: String },
  daysOption: { type: String },
  goldRate: { type: Number },
  maxDays: { type: Number },
  minInterest: { type: Number },
  minWeight: { type: Number },
  interestRndOption: { type: String },
  interestCalc: { type: String },
  processingCharge: { type: Number },
  penalInterest: { type: Number },
  penaltyCalcOption: { type: String },
  defaultLessWeight: { type: Number },
  IntRnd: { type: String },
  principalbalance: { type: String },
  ProcessingCharge: { type: String },
  PenalInt: { type: String },
  interestType: { type: [String] }
}, { timestamps: true });

module.exports = GoldLoanSchema;
