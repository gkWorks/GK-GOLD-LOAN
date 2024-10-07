const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const mongoose = require('mongoose');

// Define Company and Branch schemas if needed (simplified version)
const companySchema = new mongoose.Schema({
    companyUsername: String,
    companyPassword: String,
    companyId: String
});

const branchSchema = new mongoose.Schema({
    branchUsername: String,
    branchPassword: String,
    companyId: String,
    branchUniqueId: String
});

// Models for the Company and Branch
const CompanyModel = mongoose.model('Company', companySchema, 'companies'); // 'companies' is the collection name
const BranchModel = mongoose.model('Branch', branchSchema, 'branches'); // 'branches' is the collection name

// Login route
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        // First, check for a company login
        let user = await CompanyModel.findOne({ companyUsername: username, companyPassword: password });

        // If not a company, check for a branch
        if (!user) {
            user = await BranchModel.findOne({ branchUsername: username, branchPassword: password });
            if (user) {
                const token = jwt.sign({ 
                    userId: user._id, 
                    companyId: user.companyId, 
                    userType: 'branch' 
                }, process.env.JWT_SECRET, { expiresIn: '12h' });

                return res.status(200).json({
                    message: 'Branch login successful',
                    token,
                    userType: 'branch',
                    branchId: user.branchUniqueId,
                    companyId: user.companyId
                });
            }
        } else {
            const token = jwt.sign({
                userId: user._id,
                companyId: user.companyId,
                userType: 'company'
            }, process.env.JWT_SECRET, { expiresIn: '12h' });

            return res.status(200).json({
                message: 'Company login successful',
                token,
                userType: 'company',
                companyId: user.companyId
            });
        }

        // If no user found
        return res.status(401).json({ message: 'Invalid username or password' });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
