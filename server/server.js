const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const loginRoute = require('./routes/login');
const documentRoutes = require('./routes/masterroutes/documentRoutes');
const customerRoutes = require('./routes/customersroutes/customers');
const jewelMasterRoute = require('./routes/jewelMaster'); // Import the JewelMaster route


dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN, // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify the methods allowed
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
  credentials: true, // Allow credentials if necessary
}));

// Increase the limit for incoming request bodies
app.use(express.json({ limit: '50mb' })); // Adjust the limit as needed

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/login', loginRoute);
app.use('/api', documentRoutes);
app.use('/api/customers', customerRoutes);
app.use('/jewel-master', jewelMasterRoute); // Use the JewelMaster route


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
