const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authenticateToken = require('../../middleware/auth');
const documentSchema = require('../../models/mastermodels/documentModel');

// Middleware to authenticate token
router.use(authenticateToken);

// Connect to the "Company-Loan" database once
const dbUri = 'mongodb+srv://akash19082001:akash19082001@atlascluster.hsvvs.mongodb.net/Company-Loan';
mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create Document model for the "Company-Loan" database
const Document = mongoose.model('Document', documentSchema, 'documents');

// POST /api/register - Register a new document
router.post('/register', async (req, res) => {
  try {
    const companyId = req.user.companyId; // Get the user's company ID from the token

    const newDocument = new Document({
      ...req.body,
      companyId, // Add companyId to the new document
    });

    const savedDocument = await newDocument.save(); // Save the document to the database
    res.status(201).json({ document: savedDocument });
  } catch (error) {
    console.error('Error registering document:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/documents - Get all documents for the logged-in company
router.get('/documents', async (req, res) => {
  try {
    const companyId = req.user.companyId; // Get the user's company ID from the token

    const documents = await Document.find({ companyId }); // Fetch documents by companyId
    res.json({ documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/documents/:id - Delete a document
router.delete('/documents/:id', async (req, res) => {
  try {
    const deletedDocument = await Document.findByIdAndDelete(req.params.id);
    if (!deletedDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json({ message: 'Document deleted' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
