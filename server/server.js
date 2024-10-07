const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const loginRoute = require('./routes/login');
const documentRoutes = require('./routes/masterroutes/documentRoutes');
const customerRoutes = require('./routes/customersroutes/customers');
const jewelMasterRoute = require('./routes/jewelMaster'); // Import the JewelMaster route
const goldLoanRoutes = require('./routes/masterroutes/goldLoanRoutes');
const connectDB  = require('./DataBase/db');

dotenv.config(); // Load environment variables

const app = express();

// CORS configuration
app.use(cors());

// Increase the limit for incoming request bodies (e.g., large file uploads)
app.use(express.json({ limit: '50mb' })); // Adjust the limit as needed

const PORT = process.env.PORT || 5000; // Use the port specified in .env or default to 5000


    // Connect to MongoDB
connectDB();

// Routes setup
console.log('Setting up routes...');
app.use('/login', loginRoute); // Authentication route
app.use('/api', documentRoutes); // Document routes
app.use('/api/customers', customerRoutes); // Customer routes
app.use('/jewel-master', jewelMasterRoute); // JewelMaster routes
app.use('/api', goldLoanRoutes);


// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
