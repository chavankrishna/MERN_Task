const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Import cors middleware

const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err.message));

// Routes (assuming they are correctly defined as per previous examples)
app.use('/initDB', require('./routes/initDB'));
app.use('/transactions', require('./routes/transactions'));
app.use('/statistics', require('./routes/statistics'));
app.use('/barChart', require('./routes/barChart'));
app.use('/pieChart', require('./routes/pieChart'));
app.use('/combinedData', require('./routes/combinedData'));

// Default route
app.get('/', (req, res) => {
    res.send('Server is up and running');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});


