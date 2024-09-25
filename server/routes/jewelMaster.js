const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authenticateToken = require('../middleware/auth');
const jewelMasterSchema = require('../models/jewelMaster');

// Middleware to authenticate token
router.use(authenticateToken);

// Store connections to company databases in memory
const companyConnections = {};

// Helper function to connect to the specific company database
async function connectToCompanyDatabase(companyDomain) {
  if (!companyConnections[companyDomain]) {
    const dbUri = `mongodb+srv://akash19082001:akash19082001@atlascluster.hsvvs.mongodb.net/COMPANY_${companyDomain}`;
    const connection = await mongoose.createConnection(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    companyConnections[companyDomain] = connection; // Store the connection
  }
  return companyConnections[companyDomain];
}

// Helper function to get JewelMaster model on the specific company connection
function getJewelMasterModel(connection) {
  return connection.model('JewelMaster', jewelMasterSchema, 'JewelMaster');
}

// GET /jewel-master - Get all jewel items
router.get('/', async (req, res) => {
  try {
    const companyDomain = req.user.companyDomain;
    const connection = await connectToCompanyDatabase(companyDomain); // Connect to the company database

    const JewelMaster = getJewelMasterModel(connection);
    const items = await JewelMaster.find();
    res.json(items);
  } catch (error) {
    console.error('Error fetching jewel items:', error);
    res.status(500).json({ message: 'Server error' });
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