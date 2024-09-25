const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authenticateToken = require('../../middleware/auth');
const documentSchema = require('../../models/mastermodels/documentModel');

// Middleware to authenticate token
router.use(authenticateToken);

// Store connections to company databases in memory
const companyConnections = {};

// Helper function to connect to the specific company database
async function connectToCompanyDatabase(companyDomain) {
    if (!companyConnections[companyDomain]) {
        const dbUri = `mongodb+srv://akash19082001:akash19082001@atlascluster.hsvvs.mongodb.net/COMPANY_${companyDomain}`; // Replace with your actual MongoDB URI
        const connection = await mongoose.createConnection(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        companyConnections[companyDomain] = connection; // Store the connection
    }
    return companyConnections[companyDomain];
}

// Helper function to get Document model on the specific company connection
function getDocumentModel(connection) {
    return connection.model('Document', documentSchema, 'documents'); // Collection name can be 'documents' or whatever you prefer
}

// POST /api/register - Register a new document
router.post('/register', async (req, res) => {
    try {
        const companyDomain = req.user.companyDomain; // Get the user's company domain from the token
        const connection = await connectToCompanyDatabase(companyDomain); // Connect to the company database

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
