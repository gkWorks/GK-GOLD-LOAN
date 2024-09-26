const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/auth');
const customerSchema = require('../../models/customersmodels/customersmodels');
const { connectToCompanyDatabase } = require('../../DataBase/db'); // Reference the separate db file

// Middleware to authenticate token
router.use(authenticateToken);

// Helper function to get Customer model on the specific company connection
function getCustomerModel(connection) {
  return connection.model('Customers', customerSchema, 'Customers');
}

router.post('/', async (req, res) => {
  try {
    const companyDomain = req.user?.companyDomain; // Ensure req.user exists
    if (!companyDomain) {
      return res.status(400).json({ message: 'Company domain not found in token' });
    }

    // Use the connectToCompanyDatabase function from the separate db.js file
    const connection = await connectToCompanyDatabase(companyDomain);

    const Customers = getCustomerModel(connection);
    
    // Assuming you're receiving the customer data as req.body.finalData
    const customerData = req.body.finalData || req.body; // Support both formats
    
    const newCustomer = new Customers(customerData);
    await newCustomer.save();
    
    res.status(201).json(newCustomer);
    
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ message: 'Error creating customer', error });
  }
});

module.exports = router;
