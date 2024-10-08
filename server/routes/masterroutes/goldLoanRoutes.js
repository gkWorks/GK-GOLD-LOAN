const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authenticateToken = require('../../middleware/auth');
const GoldLoanSchema = require('../../models/mastermodels/GoldLoanmodel');


// Middleware to authenticate token
router.use(authenticateToken);

// Connect to the "Company-Loan" database once
const dbUri = 'mongodb+srv://akash19082001:akash19082001@atlascluster.hsvvs.mongodb.net/Company-Loan';
mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create GoldLoan model for "Company-Loan" database
const GoldLoan = mongoose.model('GoldLoanMaster', GoldLoanSchema, 'GoldLoanMaster');

router.post('/gold-loans', async (req, res) => {
  try {
    const companyId = req.user.companyId; // Retrieve the companyId from the token

    const newLoan = new GoldLoan({
      ...req.body,
      companyId, // Add companyId to the new loan item
    });

    await newLoan.save();
    res.status(201).json(newLoan);
  } catch (error) {
    console.error('Error adding gold loan item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new route to fetch all gold loan names
router.get('/gold-loans/names', async (req, res) => {
  try {
    const companyId = req.user.companyId; // Retrieve the companyId from the token

    const loans = await GoldLoan.find({ companyId }); // Fetch loans by companyId
    res.json(loans);
  } catch (error) {
    console.error('Error fetching gold loan items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch a specific loan by ID
router.get('/gold-loans/name/:loanName', async (req, res) => {
  try {
    const companyId = req.user.companyId; // Get companyId from token
    const loanName  = req.params.loanName; // Get loan ID from request params

    const loan = await GoldLoan.findOne({loanName: loanName, companyId: companyId }); // Find the loan by ID and companyId

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    res.json(loan); // Send the loan details
  } catch (error) {
    console.error('Error fetching loan details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Route to fetch a specific gold loan by ID
router.get('/gold-loans/:id', async (req, res) => {
  try {
    const companyId = req.user.companyId; // Retrieve the companyId from the token
    const goldLoan = await GoldLoan.findOne({ _id: req.params.id, companyId });

    if (!goldLoan) {
      return res.status(404).json({ message: 'Gold loan not found' });
    }

    res.status(200).json(goldLoan);
  } catch (error) {
    console.error('Error fetching gold loan:', error);
    res.status(500).json({ message: 'Error fetching gold loan', error });
  }
});
// Update a gold loan by ID
router.put('/gold-loans/:id', async (req, res) => {
  try {
    const companyId = req.user.companyId; // Retrieve companyId from the token

    // Find the gold loan by ID and companyId and update it
    const updatedGoldLoan = await GoldLoan.findOneAndUpdate(
      { _id: req.params.id, companyId }, // Match both ID and companyId for security
      req.body,
      { new: true } // Return the updated document
    );

    if (!updatedGoldLoan) {
      return res.status(404).json({ message: 'Gold loan not found' });
    }

    res.status(200).json(updatedGoldLoan); // Respond with updated loan details
  } catch (error) {
    console.error('Error updating gold loan:', error);
    res.status(500).json({ message: 'Error updating gold loan', error });
  }
});
// Get a specific gold loan by ID
router.get('/gold-loans/:id', async (req, res) => {
  try {
    const companyId = req.user.companyId; // Retrieve companyId from the token

    // Find the gold loan by ID and companyId for security
    const goldLoan = await GoldLoan.findOne({ _id: req.params.id, companyId });

    if (!goldLoan) {
      return res.status(404).json({ message: 'Gold loan not found' });
    }

    // If a slabImplementationDate query parameter is provided, filter the interest slabs
    const selectedDate = req.query.slabImplementationDate;
    if (selectedDate) {
      goldLoan.interestslabs = goldLoan.interestslabs.filter(
        slab => slab.slabImplementationDate === selectedDate
      );
    }

    res.status(200).json(goldLoan); // Send the filtered or full loan details
  } catch (error) {
    console.error('Error fetching gold loan:', error);
    res.status(500).json({ message: 'Error fetching gold loan', error });
  }
});

// Route to get specific slab details
router.get('/gold-loans/slabs/:loanId/:slabId', async (req, res) => {
  try {
    const { loanId, slabId } = req.params;
    const companyId = req.user.companyId; // Retrieve companyId from the token

    // Find the gold loan by loanId and companyId for security
    const goldLoan = await GoldLoan.findOne({ _id: loanId, companyId });

    if (!goldLoan) {
      return res.status(404).json({ success: false, message: 'Loan not found' });
    }

    // Find the specific slab by slabId
    const slab = goldLoan.interestslabs.id(slabId);
    if (!slab) {
      return res.status(404).json({ success: false, message: 'Slab not found' });
    }

    res.status(200).json({ success: true, data: slab });
  } catch (error) {
    console.error('Error fetching slab:', error);
    res.status(500).json({ success: false, message: 'Error fetching slab', error });
  }
});

// Route to update slab details
router.put('/gold-loans/slabs/:loanId/:slabId', async (req, res) => {
  try {
    const { loanId, slabId } = req.params;
    const { from, to, interestRate } = req.body; // Get new slab data from request body
    const companyId = req.user.companyId; // Retrieve companyId from the token

    // Find the gold loan by loanId and companyId for security
    const goldLoan = await GoldLoan.findOne({ _id: loanId, companyId });

    if (!goldLoan) {
      return res.status(404).json({ success: false, message: 'Loan not found' });
    }

    // Find the specific slab by slabId
    const slab = goldLoan.interestslabs.id(slabId);
    if (!slab) {
      return res.status(404).json({ success: false, message: 'Slab not found' });
    }

    // Update slab details
    slab.from = from;
    slab.to = to;
    slab.interestRate = interestRate;

    // Save the updated gold loan with the modified slab
    await goldLoan.save();

    res.status(200).json({ success: true, message: 'Slab updated successfully' });
  } catch (error) {
    console.error('Error updating slab:', error);
    res.status(500).json({ success: false, message: 'Error updating slab', error });
  }
});
// Route to remove slab based on loan name and slab index
router.delete('/gold-loans/slabs/remove', async (req, res) => {
  try {
    const { loanName, slabIndex } = req.body; // Expect loanName and slabIndex in the request body

    // Find the gold loan by loan name
    const goldLoan = await GoldLoan.findOne({ loanName });
    if (!goldLoan) {
      return res.status(404).json({ message: 'Gold loan not found' });
    }

    // Check if the slabIndex is valid
    if (slabIndex < 0 || slabIndex >= goldLoan.interestslabs.length) {
      return res.status(400).json({ message: 'Invalid slab index' });
    }

    // Remove the slab using the index
    goldLoan.interestslabs.splice(slabIndex, 1); // Remove the slab at the specified index

    await goldLoan.save(); // Save updated loan with modified slabs

    res.status(200).json({ message: 'Slab removed successfully', remainingSlabs: goldLoan.interestslabs });
  } catch (error) {
    console.error('Error removing slab:', error);
    res.status(500).json({ message: 'Error removing slab', error });
  }
});

module.exports = router;


module.exports = router;