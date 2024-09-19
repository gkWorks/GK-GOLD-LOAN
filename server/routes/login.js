const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const mongoose = require('mongoose');
const { companySchema, LoginTimestamp } = require('../models/company');

// Function to convert UTC date to IST
function convertUTCToIST(date) {
  const IST_OFFSET = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
  return new Date(date.getTime() + IST_OFFSET);
}

// Login Route
router.post('/', async (req, res) => {
  const { username, password, latitude, longitude } = req.body;

  console.log('Received username:', username);
  console.log('Received password:', password);
  console.log('Received latitude:', latitude);
  console.log('Received longitude:', longitude);

  try {
    const companyIdentifier = getCompanyIdentifier(username);

    // Fetch all collection names from the current database
    const collections = await mongoose.connection.db.listCollections().toArray();

    let collectionName = collections
      .map(c => c.name)
      .find(name => {
        const baseIdentifier = `COMPANY_${companyIdentifier}`;
        return name.startsWith(baseIdentifier);
      });

    if (!collectionName) {
      console.log(`No collection found for companyIdentifier: ${companyIdentifier}`);

      // If no collection for the company identifier is found, search across all company collections for branches
      const allCompanyCollections = collections
        .map(c => c.name)
        .filter(name => name.startsWith('COMPANY_'));

      for (const companyCollection of allCompanyCollections) {
        console.log(`Searching for branch in collection: ${companyCollection}`);
        const CompanyModel = mongoose.models[companyCollection] || mongoose.model(companyCollection, companySchema, companyCollection);

        const company = await CompanyModel.findOne({
          'branches.branchUsername': username,
          'branches.branchPassword': password
        });

        if (company) {
          collectionName = companyCollection;
          console.log(`Branch found in collection: ${companyCollection}`);
          break;
        }
      }

      // If no company collection contains the branch
      if (!collectionName) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
    }

    console.log('Using collection:', collectionName);

    // Dynamically create or use existing model for the found collection
    let CompanyModel = mongoose.models[collectionName] || mongoose.model(collectionName, companySchema, collectionName);

    // Try to find the company or branch by username and password
    const company = await CompanyModel.findOne({
      $or: [
        { companyUsername: username, companyPassword: password }, // Check for company login
        { 'branches.branchUsername': username, 'branches.branchPassword': password } // Check for branch login
      ]
    });

    console.log(`Company document found: ${company ? true : false}`);

    if (!company) {
      console.log('Company or branch not found with provided credentials.');
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    let validPassword = false;
    let userType = '';

    // Check if it's a company login
    if (company.companyUsername === username && company.companyPassword === password) {
      validPassword = true;
      userType = 'company';
      console.log('Company login successful.');
    } else {
      // Check for branch login
      const branch = company.branches.find(branch => branch.branchUsername === username && branch.branchPassword === password);
      if (branch) {
        validPassword = true;
        userType = 'branch';
        console.log(`Branch login successful for branch: ${branch.branchName}`);
      }
    }

    if (!validPassword) {
      console.log('Invalid username or password after checks.');
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Capture IP address and device info
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const deviceInfo = req.headers['user-agent'];

    // Store login timestamp, IP address, device info, and geolocation
    const istTimestamp = convertUTCToIST(new Date());
    await LoginTimestamp.create({
      username,
      timestamp: istTimestamp,
      userType,
      ipAddress,
      deviceInfo,
      latitude,
      longitude
    });

    // Generate JWT token
    const token = jwt.sign({ username, userType }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ message: 'Login successful', token, userType });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to extract company identifier from the username
function getCompanyIdentifier(username) {
  const companyDomain = username.split('@')[1].split('.')[0];
  const companyIdentifier = companyDomain.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase();

  console.log('Extracted companyIdentifier:', companyIdentifier); // Debugging line
  return companyIdentifier;
}

module.exports = router;
