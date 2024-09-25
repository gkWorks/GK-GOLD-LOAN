const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authenticateToken = require('../../middleware/auth');
const documentSchema = require('../../models/mastermodels/documentModel'); // Ensure schema is properly imported

// Middleware to authenticate token
router.use(authenticateToken);

// Store connections to company databases in memory
const companyConnections = {};

// Helper function to connect to the specific company database
async function connectToCompanyDatabase(companyDomain) {
    if (!companyConnections[companyDomain]) {
        try {
            const dbUri = `mongodb+srv://akash19082001:akash19082001@atlascluster.hsvvs.mongodb.net/COMPANY_${companyDomain}`;
            const connection = await mongoose.createConnection(dbUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            companyConnections[companyDomain] = connection; // Store the connection
        } catch (error) {
            console.error('Error connecting to company database:', error); // Improved error logging
            throw new Error('Database connection error');
        }
    }
    return companyConnections[companyDomain];
}

// Helper function to get Document model on the specific company connection
function getDocumentModel(connection) {
    return connection.model('Document', documentSchema, 'documents'); // Ensure 'documentSchema' is correctly referenced
}

// POST /api/register - Register a new document
router.post('/register', async (req, res) => {
    try {
        const companyDomain = req.user.companyDomain; // Get the user's company domain from the token
        if (!companyDomain) throw new Error('No companyDomain in token');

        const connection = await connectToCompanyDatabase(companyDomain); // Connect to the company database
        const Document = getDocumentModel(connection);
        const newDocument = new Document(req.body);

        await newDocument.save();
        res.status(201).json(newDocument);
    } catch (error) {
        console.error('Error registering document:', error); // Improved error logging
        res.status(500).json({ message: 'Server error: Could not register document' });
    }
});

// GET /api/documents - Get all documents
router.get('/documents', async (req, res) => {
    try {
        const companyDomain = req.user.companyDomain; // Get the user's company domain from the token
        if (!companyDomain) throw new Error('No companyDomain in token');

        const connection = await connectToCompanyDatabase(companyDomain); // Connect to the company database
        const Document = getDocumentModel(connection);

        const documents = await Document.find();
        res.json({ documents });
    } catch (error) {
        console.error('Error fetching documents:', error); // Improved error logging
        res.status(500).json({ message: 'Server error: Could not fetch documents' });
    }
});

// DELETE /api/documents/:id - Delete a document
router.delete('/documents/:id', async (req, res) => {
    try {
        const companyDomain = req.user.companyDomain; // Get the user's company domain from the token
        if (!companyDomain) throw new Error('No companyDomain in token');

        const connection = await connectToCompanyDatabase(companyDomain); // Connect to the company database
        const Document = getDocumentModel(connection);

        const deletedDocument = await Document.findByIdAndDelete(req.params.id);
        if (!deletedDocument) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.json({ message: 'Document deleted' });
    } catch (error) {
        console.error('Error deleting document:', error); // Improved error logging
        res.status(500).json({ message: 'Server error: Could not delete document' });
    }
});

module.exports = router;
