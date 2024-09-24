const express = require('express');
const router = express.Router();
const DocumentRegistered = require('../../models/mastermodels/documentModel');

// Route to register a document
router.post('/register', async (req, res) => {
  const { documentName } = req.body;

  if (!documentName) {
    return res.status(400).json({ message: 'Document name is required' });
  }

  try {
    const newDocument = new DocumentRegistered({ documentName });
    await newDocument.save();
    return res.status(201).json({ message: 'Document registered successfully', document: newDocument });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Route to get all documents
router.get('/documents', async (req, res) => {
  try {
    const documents = await DocumentRegistered.find();
    return res.status(200).json({ documents });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Route to delete a document by ID
router.delete('/documents/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedDocument = await DocumentRegistered.findByIdAndDelete(id);
      if (!deletedDocument) {
        return res.status(404).json({ message: 'Document not found' });
      }
      return res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
module.exports = router;
