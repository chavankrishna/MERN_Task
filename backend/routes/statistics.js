// routes/statistics.js

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

        // Aggregate pipeline to calculate total sale amount
        const totalSaleAmount = await Transaction.aggregate([
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
                    sold: 1,
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
                    _id: null,
                    total: { $sum: { $toDouble: "$price" } }
                }
            }
        ]);

        // Aggregate pipeline to calculate total sold items
        const totalSoldItems = await Transaction.aggregate([
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
                    sold: 1,
                    month: { $month: "$dateOfSaleDate" }
                }
            },
            {
                $match: {
                    month: monthInt
                }
            },
            {
                $count: "totalSoldItems"
            }
        ]);

        // Aggregate pipeline to calculate total not sold items
        const totalNotSoldItems = await Transaction.aggregate([
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
                    sold: 1,
                    month: { $month: "$dateOfSaleDate" }
                }
            },
            {
                $match: {
                    month: monthInt,
                    sold: false
                }
            },
            {
                $count: "totalNotSoldItems"
            }
        ]);

        res.status(200).json({
            totalSaleAmount: totalSaleAmount.length > 0 ? totalSaleAmount[0].total : 0,
            totalSoldItems: totalSoldItems.length > 0 ? totalSoldItems[0].totalSoldItems : 0,
            totalNotSoldItems: totalNotSoldItems.length > 0 ? totalNotSoldItems[0].totalNotSoldItems : 0
        });
    } catch (error) {
        console.error('Error fetching statistics:', error.message);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

module.exports = router;
