// db.js
const mongoose = require('mongoose');

const companyConnections = {}; // Store connections in memory

// Function to connect to a specific company's database
async function connectToCompanyDatabase(companyDomain) {
  if (!companyConnections[companyDomain]) {
    const dbUri = `mongodb+srv://akash19082001:akash19082001@atlascluster.hsvvs.mongodb.net/COMPANY_${companyDomain}`;
    const connection = await mongoose.createConnection(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    companyConnections[companyDomain] = connection; // Cache the connection
  }
  return companyConnections[companyDomain];
}

module.exports = {
  connectToCompanyDatabase,
};
