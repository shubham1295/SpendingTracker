const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Sugar = require('sugar');
const Spending = require('../models/spending');
const Category = require('../models/category');

router.get("/", (req, res, next) => {

    res.status(200).render('setting');

});

module.exports = router;