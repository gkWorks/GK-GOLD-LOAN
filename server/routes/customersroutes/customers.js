const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authenticateToken = require('../../middleware/auth');
const customerSchema = require('../../models/customersmodels/customersmodels');

// Middleware to authenticate token
router.use(authenticateToken);

// Connect to the "Company-Loan" database once
const dbUri = 'mongodb+srv://akash19082001:akash19082001@atlascluster.hsvvs.mongodb.net/Company-Loan';
mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create Customers model for "Company-Loan" database
const CustomersReg = mongoose.model('CustomerREG', customerSchema, 'CustomerREG');

router.post('/', async (req, res) => {
  console.log(req.body);  // Debugging: Log the incoming request data
  try {
    const companyId = req.user.companyId; // Retrieve the companyId from the token

    // Log the companyId for debugging
    console.log('Company ID:', companyId);

    // Fetch the latest customer for this company to determine the next customerId
    const latestCustomer = await CustomersReg.findOne({ companyId }).sort({ customerId: -1 });
    let nextCustomerId = latestCustomer ? latestCustomer.customerId + 1 : 1;

    // Check for existing customerId and find a unique one
    const existingCustomer = await CustomersReg.findOne({ companyId, customerId: nextCustomerId });
    while (existingCustomer) {
      nextCustomerId++; // Increment to find a new ID
      existingCustomer = await CustomersReg.findOne({ companyId, customerId: nextCustomerId });
    }

    // Create the new customer data with the unique customerId
    const newCustomer = new CustomersReg({
      ...req.body,
      customerId: nextCustomerId, // Set the generated customerId
      companyId, // Add companyId to the new item
    });

    // log the new customer data before saving it in new database
    console.log('New Customer:', newCustomer);

    await newCustomer.save();
    res.status(201).json(newCustomer);
    
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error
      return res.status(409).json({ message: 'Duplicate customerId found for this company', error });
    }
    console.error('Error creating customer:', error);
    res.status(500).json({ message: 'Error creating customer', error });
  }
});


// GET route for searching customers
router.get('/CustomerSerch', authenticateToken, async (req, res) => {
  try {

    
    const companyId = req.user.companyId; // Retrieve the companyId from the token

    const customers = await CustomersReg.find({ companyId }); // Fetch items by companyId
    res.json(customers);
  } catch (error) {
    console.error('Error searching Customers:', error);
    res.status(500).json({ message: 'Error Searching Customers', error });
  }
});

// GET route for fetching a customer by ID
router.get('/customers/:customerId', authenticateToken, async (req, res) => {
  try {
    const companyId = req.user.companyId; // Retrieve the companyId from the token
    const customerId = parseInt(req.params.customerId); // Get customerId from the request URL

    // Find the customer by customerId
    const customer = await CustomersReg.findOne({ customerId: customerId, companyId: companyId  });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    console.error('Error fetching customers', error);
    res.status(500).json({ message: 'Error fetching customer', error });
  }
});

// PUT route for updating a customer
router.put('/:customerId', authenticateToken, async (req, res) => {
  try {
    const companyId = req.user.companyId; // Retrieve the companyId from the token
    const customerId = parseInt(req.params.customerId); // Ensure customerId is parsed as an integer
    const updateData = req.body; // Customer data to update

    // Find the customer by customerId and companyId to update
    const updatedCustomer = await CustomersReg.findOneAndUpdate(
      { customerId: customerId, companyId: companyId }, // Search condition
      updateData, // Data to update
      { new: true } // Return the updated customer
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found in this company.' });
    }

    res.json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ message: 'Error updating customer', error });
  }
});

module.exports = router;
