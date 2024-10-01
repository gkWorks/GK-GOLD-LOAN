const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/auth');
const GoldLoan = require('../../models/mastermodels/GoldLoanmodel');
const { connectToCompanyDatabase } = require('../../DataBase/db'); // Reference the separate db file

// Middleware to authenticate token
router.use(authenticateToken);

router.post('/gold-loans', async (req, res) => {
  try {
    const companyDomain = req.user?.companyDomain; // Ensure req.user exists
    if (!companyDomain) {
      return res.status(400).json({ message: 'Company domain not found in token' });
    }

    // Use the connectToCompanyDatabase function from the separate db.js file
    const connection = await connectToCompanyDatabase(companyDomain);
    
    const GoldLoanModel = connection.model('GoldLoan', GoldLoan, 'GoldLoan');

    const newGoldLoan = new GoldLoanModel(req.body);
    const savedGoldLoan = await newGoldLoan.save();

    res.status(201).json(savedGoldLoan);
  } catch (error) {
    console.error('Error creating gold loan:', error);
    res.status(500).json({ message: 'Error creating gold loan', error });
  }
});

// Add a new route to fetch all gold loan names
router.get('/gold-loans/names', async (req, res) => {
  try {
    const companyDomain = req.user?.companyDomain;
    if (!companyDomain) {
      return res.status(400).json({ message: 'Company domain not found in token' });
    }

    const connection = await connectToCompanyDatabase(companyDomain);
    const GoldLoanModel = connection.model('GoldLoan', GoldLoan, 'GoldLoan');

    // Fetch only the loan names
    const loanNames = await GoldLoanModel.find({}, 'loanName'); // Select only loanName field
    res.status(200).json(loanNames);
  } catch (error) {
    console.error('Error fetching loan names:', error);
    res.status(500).json({ message: 'Error fetching loan names', error });
  }
});


module.exports = router;
