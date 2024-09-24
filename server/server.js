const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const loginRoute = require('./routes/login');
const documentRoutes = require('./routes/masterroutes/documentRoutes');
const customerRoutes = require('./routes/customersroutes/customers');

dotenv.config();

const app = express();
app.use(cors());

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

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
