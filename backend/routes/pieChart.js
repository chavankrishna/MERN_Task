// routes/pieChart.js

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

        // Aggregate pipeline to calculate pie chart data
        const pieChartData = await Transaction.aggregate([
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
                    category: 1,
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
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        const formattedChartData = pieChartData.map(item => ({
            category: item._id,
            count: item.count
        }));

        res.status(200).json(formattedChartData);
    } catch (error) {
        console.error('Error generating pie chart data:', error.message);
        res.status(500).json({ error: 'Failed to generate pie chart data' });
    }
});

module.exports = router;
