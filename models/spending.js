const mongoose = require('mongoose');

const spendingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    item: String,
    date: Date, // Format YYYY-MM-DD 2019-12-20
    cost: Number ,
    category: String
});

module.exports = mongoose.model('spending', spendingSchema);