const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const loginRoute = require('./routes/login');
const documentRoutes = require('./routes/masterroutes/documentRoutes');
const customerRoutes = require('./routes/customersroutes/customers');
const jewelMasterRoute = require('./routes/jewelMaster');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const PORT = process.env.PORT || 5000;

// MongoDB connection
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);  // Exit the app if the DB connection fails
  });

// Routes
console.log('Setting up routes...');
app.use('/login', loginRoute);
app.use('/api', documentRoutes);
app.use('/api/customers', customerRoutes);
app.use('/jewel-master', jewelMasterRoute);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
