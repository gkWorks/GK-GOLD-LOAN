const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authenticateToken = require('../middleware/auth');
const jewelMasterSchema = require('../models/jewelMaster');

// Middleware to authenticate token
router.use(authenticateToken);

// Connect to the "Company-Loan" database once
const dbUri = 'mongodb+srv://akash19082001:akash19082001@atlascluster.hsvvs.mongodb.net/Company-Loan';
mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create JewelMaster model for "Company-Loan" database
const JewelMaster = mongoose.model('JewelMaster', jewelMasterSchema, 'JewelMaster');

// POST /jewel-master - Add a new jewel item
router.post('/', async (req, res) => {
  try {
    const companyId = req.user.companyId; // Retrieve the companyId from the token

    const newItem = new JewelMaster({
      ...req.body,
      companyId, // Add companyId to the new item
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding jewel item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /jewel-master - Get all jewel items for the logged-in company
router.get('/', async (req, res) => {
  try {
    const companyId = req.user.companyId; // Retrieve the companyId from the token

    const items = await JewelMaster.find({ companyId }); // Fetch items by companyId
    res.json(items);
  } catch (error) {
    console.error('Error fetching jewel items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// PUT /jewel-master/:id - Update an existing jewel item
router.put('/:id', async (req, res) => {
  try {
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
