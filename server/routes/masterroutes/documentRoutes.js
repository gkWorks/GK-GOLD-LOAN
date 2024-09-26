const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/auth');
const { connectToCompanyDatabase } = require('../../DataBase/db'); // Import the shared DB connection
const documentSchema = require('../../models/mastermodels/documentModel');

router.use(authenticateToken);

function getDocumentModel(connection) {
  return connection.model('Document', documentSchema, 'documents');
}

router.post('/register', async (req, res) => {
  try {
    const companyDomain = req.user.companyDomain;
    const connection = await connectToCompanyDatabase(companyDomain);
    const Document = getDocumentModel(connection);
    const newDocument = new Document(req.body);
    await newDocument.save();
    res.status(201).json(newDocument);
  } catch (error) {
    console.error('Error registering document:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/documents - Get all documents
router.get('/documents', async (req, res) => {
    try {
        const companyDomain = req.user.companyDomain; // Get the user's company domain from the token
        const connection = await connectToCompanyDatabase(companyDomain); // Connect to the company database

        const Document = getDocumentModel(connection);
        const documents = await Document.find();
        res.json({ documents });
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/documents/:id - Delete a document
router.delete('/documents/:id', async (req, res) => {
    try {
        const companyDomain = req.user.companyDomain; // Get the user's company domain from the token
        const connection = await connectToCompanyDatabase(companyDomain); // Connect to the company database

        const Document = getDocumentModel(connection);
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