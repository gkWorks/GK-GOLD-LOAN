const express = require('express');
const router = express.Router();
const Customer = require('../../models/customersmodels/customersmodels');

router.post('/', async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ message: 'Error creating customer', error });
  }
});

module.exports = router;
