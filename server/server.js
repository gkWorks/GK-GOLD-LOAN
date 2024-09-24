const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const loginRoute = require('./routes/login');
const jewelMasterRoute = require('./routes/jewelMaster'); // Import the JewelMaster route

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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
app.use('/jewel-master', jewelMasterRoute); // Use the JewelMaster route

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
