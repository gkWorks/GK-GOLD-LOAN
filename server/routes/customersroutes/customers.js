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

    // Fetch the latest customer to determine the next customerId
    const latestCustomer = await Customers.findOne().sort({ customerId: -1 });
    const nextCustomerId = latestCustomer ? latestCustomer.customerId + 1 : 1;

    // Add the customerId to the customer data
    customerData.customerId = nextCustomerId;
    
    const newCustomer = new Customers(customerData);
    await newCustomer.save();
    
    res.status(201).json(newCustomer);
    
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ message: 'Error creating customer', error });
  }
});

// routes/customers.js
router.get('/CustomerSerch', authenticateToken, async (req, res) => {
  try {
    const { name, aadhaarNo, mobileNo } = req.query; // Get query params from request
    const companyDomain = req.user.companyDomain;
    const connection = await connectToCompanyDatabase(companyDomain);

    const Customers = getCustomerModel(connection);

    // Build search query dynamically
    const query = {};
    if (name) query.name = new RegExp(name, 'i'); // Case-insensitive search
    if (aadhaarNo) query.aadhaarNo = aadhaarNo;
    if (mobileNo) query.mobileNo = mobileNo;
    

    // Fetch filtered customers based on the query
    const customers = await Customers.find(query);
    
    res.json(customers);
  } catch (error) {
    console.error('Error searching customers:', error);
    res.status(500).json({ message: 'Error searching customers', error });
  }
});

// PUT route for updating a customer
router.put('/:customerId', authenticateToken, async (req, res) => {
  try {
    const companyDomain = req.user?.companyDomain;
    if (!companyDomain) {
      return res.status(400).json({ message: 'Company domain not found in token' });
    }

    const connection = await connectToCompanyDatabase(companyDomain);
    const Customers = getCustomerModel(connection);

    const customerId = req.params.customerId; // Get customerId from the request URL
    const updateData = req.body; // Customer data to update

    // Find the customer by customerId and update
    const updatedCustomer = await Customers.findOneAndUpdate(
      { customerId: customerId }, // Search condition
      updateData, // Data to update
      { new: true } // Return the updated customer
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ message: 'Error updating customer', error });
  }
});

// GET route for fetching a customer by ID
router.get('/customers/:customerId', authenticateToken, async (req, res) => {
  try {
    const companyDomain = req.user?.companyDomain;
    if (!companyDomain) {
      return res.status(400).json({ message: 'Company domain not found in token' });
    }
    const connection = await connectToCompanyDatabase(companyDomain);
    const Customers = getCustomerModel(connection);

    const customerId = req.params.customerId; // Get customerId from the request URL

    // Find the customer by customerId
    const customer = await Customers.findOne({ customerId: customerId });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ message: 'Error fetching customer', error });
  }
});


module.exports = router;
