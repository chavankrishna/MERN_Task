const express = require('express');
const Transaction = require('../models/Transaction');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { month, page = 1, perPage = 10, search = '' } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(perPage);

        // Construct query based on month and search parameters
        const query = {};
        if (month) {
            query.dateOfSale = { $regex: `-${month}-`, $options: 'i' };
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { price: { $regex: search, $options: 'i' } }
            ];
        }

        // Fetch transactions based on constructed query
        const transactions = await Transaction.find(query)
            .skip(skip)
            .limit(parseInt(perPage))
            .exec();

        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error.message);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

module.exports = router;
