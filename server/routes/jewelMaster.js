const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authenticateToken = require('../middleware/auth');
const jewelMasterSchema = require('../models/jewelMaster');
const cors = require('cors');

router.use(cors()); // Enable CORS for API requests

// Middleware to authenticate token
router.use(authenticateToken);

// Cache for mongoose connections to avoid opening/closing repeatedly
const connectionCache = {};

// Helper function to connect to the specific company database
async function connectToCompanyDatabase(companyDomain) {
  if (connectionCache[companyDomain]) {
    return connectionCache[companyDomain];
  }

  try {
    const dbUri = `mongodb+srv://your_username:your_password@atlascluster.hsvvs.mongodb.net/${companyDomain}?retryWrites=true&w=majority`;
    const connection = await mongoose.createConnection(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (!connection) {
      throw new Error('Database connection failed.');
    }

    // Cache the connection for future requests
    connectionCache[companyDomain] = connection;

    return connection;
  } catch (error) {
    console.error('Error connecting to company database:', error);
    throw error;
  }
}

// Helper function to get JewelMaster model on the specific company connection
function getJewelMasterModel(connection) {
  if (!connection.models.JewelMaster) {
    return connection.model('JewelMaster', jewelMasterSchema);
  }
  return connection.models.JewelMaster;
}

// GET /jewel-master - Get all jewel items
router.get('/', async (req, res) => {
  try {
    const companyDomain = req.user.companyDomain;

    if (!companyDomain) {
      return res.status(400).json({ message: 'Company identifier is required' });
    }

    const connection = await connectToCompanyDatabase(companyDomain);
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
  const { itemName } = req.body;

  if (!itemName) {
    return res.status(400).json({ message: 'Item name is required' });
  }

  try {
    const companyDomain = req.user.companyDomain;

    if (!companyDomain) {
      return res.status(400).json({ message: 'Company identifier is required' });
    }

    const connection = await connectToCompanyDatabase(companyDomain);
    const JewelMaster = getJewelMasterModel(connection);
    const newItem = new JewelMaster(req.body);

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding jewel item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /jewel-master/:id - Remove a jewel item
router.delete('/:id', async (req, res) => {
  try {
    const companyDomain = req.user.companyDomain;

    if (!companyDomain) {
      return res.status(400).json({ message: 'Company identifier is required' });
    }

    const connection = await connectToCompanyDatabase(companyDomain);
    const JewelMaster = getJewelMasterModel(connection);
    const deletedItem = await JewelMaster.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Jewel item not found' });
    }

    res.json({ message: 'Jewel item deleted successfully' });
  } catch (error) {
    console.error('Error deleting jewel item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
