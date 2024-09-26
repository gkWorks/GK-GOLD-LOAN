const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { connectToCompanyDatabase } = require('../DataBase/db'); // Using shared DB connection utility
const jewelMasterSchema = require('../models/jewelMaster');

// Middleware to authenticate token
router.use(authenticateToken);

// Helper function to get JewelMaster model
function getJewelMasterModel(connection) {
  return connection.model('JewelMaster', jewelMasterSchema, 'JewelMaster');
}

// GET /jewel-master - Fetch all jewel items
router.get('/', async (req, res) => {
  try {
    const companyDomain = req.user.companyDomain; // Extract company domain from authenticated user token
    const connection = await connectToCompanyDatabase(companyDomain); // Use the shared DB connection utility
    const JewelMaster = getJewelMasterModel(connection); // Get the JewelMaster model
    const items = await JewelMaster.find(); // Fetch all jewel items
    res.json(items); // Return items in JSON format
  } catch (error) {
    console.error('Error fetching jewel items:', error); // Log error to the console
    res.status(500).json({ message: 'Server error' }); // Return server error response
  }
});

// POST /jewel-master - Add a new jewel item
router.post('/', async (req, res) => {
  try {
    const companyDomain = req.user.companyDomain;
    const connection = await connectToCompanyDatabase(companyDomain); // Connect to the company database
    const JewelMaster = getJewelMasterModel(connection);
    const newItem = new JewelMaster(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding jewel item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /jewel-master/:id - Update an existing jewel item
router.put('/:id', async (req, res) => {
  try {
    const companyDomain = req.user.companyDomain;
    const connection = await connectToCompanyDatabase(companyDomain); // Connect to the company database

    const JewelMaster = getJewelMasterModel(connection);
    const updatedItem = await JewelMaster.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ message: 'Jewel item not found' });
    }
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating jewel item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /jewel-master/:id - Delete a jewel item
router.delete('/:id', async (req, res) => {
  try {
    const companyDomain = req.user.companyDomain;
    const connection = await connectToCompanyDatabase(companyDomain); // Connect to the company database

    const JewelMaster = getJewelMasterModel(connection);
    const deletedItem = await JewelMaster.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Jewel item not found' });
    }
    res.json({ message: 'Jewel item deleted' });
  } catch (error) {
    console.error('Error deleting jewel item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;