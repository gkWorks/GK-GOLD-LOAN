const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const loginRoute = require('./routes/login');
const documentRoutes = require('./routes/masterroutes/documentRoutes');
const customerRoutes = require('./routes/customersroutes/customers');
const jewelMasterRoute = require('./routes/jewelMaster'); // Import the JewelMaster route

dotenv.config(); // Load environment variables

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN, // Allow requests from this origin (specified in .env)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow credentials if necessary (cookies, etc.)
}));

// Increase the limit for incoming request bodies (e.g., large file uploads)
app.use(express.json({ limit: '50mb' })); // Adjust the limit as needed

const PORT = process.env.PORT || 5000; // Use the port specified in .env or default to 5000

// MongoDB connection
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);  // Exit the app if the DB connection fails
  });

// Routes setup
console.log('Setting up routes...');
app.use('/login', loginRoute); // Authentication route
app.use('/api', documentRoutes); // Document routes
app.use('/api/customers', customerRoutes); // Customer routes
app.use('/jewel-master', jewelMasterRoute); // JewelMaster routes

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
