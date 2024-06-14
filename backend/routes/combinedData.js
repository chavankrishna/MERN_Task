// routes/combinedData.js

const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { month } = req.query;

        // Validate month parameter
        if (!month || isNaN(month) || month < 1 || month > 12) {
            return res.status(400).json({ error: 'Invalid month parameter' });
        }

        const monthInt = parseInt(month);

        const initDBUrl = 'http://localhost:3000/initDB';
        const transactionsUrl = `http://localhost:3000/transactions`;
        const statisticsUrl = `http://localhost:3000/statistics?month=${monthInt}`;
        const barChartUrl = `http://localhost:3000/barChart?month=${monthInt}`;
        const pieChartUrl = `http://localhost:3000/pieChart?month=${monthInt}`;

        const [initDBResponse, transactionsResponse, statisticsResponse, barChartResponse, pieChartResponse] = await Promise.all([
            axios.get(initDBUrl),
            axios.get(transactionsUrl),
            axios.get(statisticsUrl),
            axios.get(barChartUrl),
            axios.get(pieChartUrl)
        ]);

        const combinedData = {
            initDB: initDBResponse.data,
            transactions: transactionsResponse.data,
            statistics: statisticsResponse.data,
            barChart: barChartResponse.data,
            pieChart: pieChartResponse.data
        };

        res.status(200).json(combinedData);
    } catch (error) {
        console.error('Error fetching combined data:', error.message);
        res.status(500).json({ error: 'Failed to fetch combined data' });
    }
});

module.exports = router;
