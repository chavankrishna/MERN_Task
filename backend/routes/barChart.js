// routes/barChart.js

const express = require('express');
const Transaction = require('../models/Transaction');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { month } = req.query;

        // Validate month parameter
        if (!month || isNaN(month) || month < 1 || month > 12) {
            return res.status(400).json({ error: 'Invalid month parameter' });
        }

        const monthInt = parseInt(month);

        // Aggregate pipeline to generate bar chart data
        const barChartData = await Transaction.aggregate([
            {
                $addFields: {
                    dateOfSaleDate: {
                        $dateFromString: {
                            dateString: "$dateOfSale"
                        }
                    }
                }
            },
            {
                $project: {
                    price: 1,
                    month: { $month: "$dateOfSaleDate" }
                }
            },
            {
                $match: {
                    month: monthInt
                }
            },
            {
                $group: {
                    _id: {
                        $switch: {
                            branches: [
                                { case: { $lte: [{ $toDouble: '$price' }, 100] }, then: '0-100' },
                                { case: { $and: [{ $gt: [{ $toDouble: '$price' }, 100] }, { $lte: [{ $toDouble: '$price' }, 200] }] }, then: '101-200' },
                                { case: { $and: [{ $gt: [{ $toDouble: '$price' }, 200] }, { $lte: [{ $toDouble: '$price' }, 300] }] }, then: '201-300' },
                                { case: { $and: [{ $gt: [{ $toDouble: '$price' }, 300] }, { $lte: [{ $toDouble: '$price' }, 400] }] }, then: '301-400' },
                                { case: { $and: [{ $gt: [{ $toDouble: '$price' }, 400] }, { $lte: [{ $toDouble: '$price' }, 500] }] }, then: '401-500' },
                                { case: { $and: [{ $gt: [{ $toDouble: '$price' }, 500] }, { $lte: [{ $toDouble: '$price' }, 600] }] }, then: '501-600' },
                                { case: { $and: [{ $gt: [{ $toDouble: '$price' }, 600] }, { $lte: [{ $toDouble: '$price' }, 700] }] }, then: '601-700' },
                                { case: { $and: [{ $gt: [{ $toDouble: '$price' }, 700] }, { $lte: [{ $toDouble: '$price' }, 800] }] }, then: '701-800' },
                                { case: { $and: [{ $gt: [{ $toDouble: '$price' }, 800] }, { $lte: [{ $toDouble: '$price' }, 900] }] }, then: '801-900' },
                                { case: { $gt: [{ $toDouble: '$price' }, 900] }, then: '901-above' }
                            ],
                            default: 'Unknown'
                        }
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json(barChartData);
    } catch (error) {
        console.error('Error generating bar chart data:', error.message);
        res.status(500).json({ error: 'Failed to generate bar chart data' });
    }
});

module.exports = router;
