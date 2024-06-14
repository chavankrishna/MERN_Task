// models/Transaction.js

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    id : Number,
    title: String,
    description: String,
    price: String,
    category: String,
    dateOfSale: String,
    sold: Boolean,
    image: String
});

module.exports = mongoose.model('Transaction', transactionSchema);
