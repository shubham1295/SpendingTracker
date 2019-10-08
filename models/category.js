const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    category: String,
    // Description: String
});

module.exports = mongoose.model('category', categorySchema, 'category');