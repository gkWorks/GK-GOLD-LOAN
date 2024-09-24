const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const mongoose = require('mongoose');
const { companySchema } = require('../models/company'); // Remove LoginTimestamp from global import

// Function to convert UTC date to IST
function convertUTCToIST(date) {
  const IST_OFFSET = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
  return new Date(date.getTime() + IST_OFFSET);
}

// Helper function to extract company and branch identifier from the username
function getCompanyAndBranchIdentifier(username) {
  const [emailPrefix, domain] = username.split('@');
  const [companyDomain, branchSuffix] = domain.split('.');

  return {
    companyDomain: companyDomain.toUpperCase(),
    branchSuffix: branchSuffix ? branchSuffix.toLowerCase() : null
  };
}

// Helper function to connect to the specific company database
async function connectToCompanyDatabase(companyDomain) {
  const dbUri = `mongodb+srv://akash19082001:akash19082001@atlascluster.hsvvs.mongodb.net/COMPANY_${companyDomain}`;
  console.log('Connecting to database:', dbUri);
  const companyConnection = await mongoose.createConnection(dbUri).asPromise();
  return companyConnection;
}

// Function to find a branch user across all branch collections
async function findBranchUser(companyConnection, branchSuffix, username, password) {
  const db = companyConnection.db; // Correctly access the native db object
  const collections = await db.listCollections().toArray();
  const branchCollections = collections.filter(col => col.name.startsWith('branch_'));

  for (const branchCollection of branchCollections) {
    // Check if the branchSuffix matches the collection name
    if (branchSuffix && !branchCollection.name.includes(branchSuffix.toLowerCase())) {
      continue; // Skip collections that don't match the branch suffix
    }

    const BranchModel = companyConnection.model(branchCollection.name, companySchema, branchCollection.name);
    const branch = await BranchModel.findOne({ branchUsername: username, branchPassword: password });
    if (branch) {
      return { branch, collection: branchCollection.name };
    }
  }

  return null;
}

// Login Route
router.post('/', async (req, res) => {
  const { username, password, latitude, longitude } = req.body;

  try {
    const { companyDomain, branchSuffix } = getCompanyAndBranchIdentifier(username);

    if (!companyDomain) {
      return res.status(400).json({ message: 'Invalid company identifier' });
    }

    console.log('Company Domain:', companyDomain);
    console.log('Branch Suffix:', branchSuffix);

    // Connect to the company-specific database
    const companyConnection = await connectToCompanyDatabase(companyDomain);
    console.log('Connected to company database:', companyDomain);

    // Access the `COMPANY` collection
    const CompanyModel = companyConnection.model('COMPANY', companySchema, 'COMPANY');

    // Dynamically create the LoginTimestamp model in the company database
    const loginTimestampSchema = new mongoose.Schema({
      username: String,
      timestamp: Date,
      userType: String,
      ipAddress: String,
      deviceInfo: String,
      latitude: Number,
      longitude: Number
    });

    const LoginTimestamp = companyConnection.model('LoginTimestamp', loginTimestampSchema, 'LoginTimestamp');

    // Check if it's a company login (no branch suffix)
    if (!branchSuffix) {
      const company = await CompanyModel.findOne({
        companyUsername: username,
        companyPassword: password
      });

      if (company) {
        // Company login successful
        console.log('Company found:', company);

        // Capture IP address and device info
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const deviceInfo = req.headers['user-agent'];

        // Store login timestamp, IP address, device info, and geolocation in the correct company database
        const istTimestamp = convertUTCToIST(new Date());
        await LoginTimestamp.create({
          username,
          timestamp: istTimestamp,
          userType: 'company',
          ipAddress,
          deviceInfo,
          latitude,
          longitude
        });

         // Company login successful
        const companyIdentifier = `COMPANY_${companyDomain}`; // Create a company-specific identifier

        // Generate JWT token for company login
        const token = jwt.sign(
          { username, userType: 'company', companyDomain },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        return res.status(200).json({ message: 'Company login successful', token, userType: 'company' });
      }
    }

    // If no company login, try to find a branch user
    const branchResult = await findBranchUser(companyConnection, branchSuffix, username, password);

    if (branchResult && branchResult.branch) {
      // Branch login successful
      console.log('Branch found in collection:', branchResult.collection);

      // Capture IP address and device info
      const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const deviceInfo = req.headers['user-agent'];

      // Store login timestamp, IP address, device info, and geolocation in the correct company database
      const istTimestamp = convertUTCToIST(new Date());
      await LoginTimestamp.create({
        username,
        timestamp: istTimestamp,
        userType: 'branch',
        ipAddress,
        deviceInfo,
        latitude,
        longitude
      });

       // Branch login successful
      const companyIdentifier = `COMPANY_${companyDomain}`; // Create a company-specific identifier

      // Generate JWT token for branch login
      const token = jwt.sign(
        { username, userType: 'branch', companyDomain },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.status(200).json({ message: 'Branch login successful', token, userType: 'branch' });
    }

    // If no branch or company found
    console.log('Invalid Username or Password');
    return res.status(401).json({ message: 'Invalid Username or Password' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
