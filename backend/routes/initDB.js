// routes/initDB.js

const express = require('express');
const axios = require('axios');
const Transaction = require('../models/Transaction');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Fetch data from third-party API
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        // Clear existing data
        await Transaction.deleteMany();

        // Insert new data into database
        await Transaction.insertMany(transactions);

        res.status(200).json({ message: 'Database initialized with clothes data' });
    } catch (error) {
        console.error('Error initializing database:', error.message);
        res.status(500).json({ error: 'Failed to initialize database' });
    }
});

module.exports = router;
