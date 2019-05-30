const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Spending = require('../models/spending');

router.get("/", (req, res, next) => {

    var currentDate = new Date(); 
    var currMonth = currentDate.getMonth()+1;

    // res.status(200).json({
    //     message: month,
    // });

    Spending.aggregate([
        { $project: { month: { $month: '$date' }, cost: true } },
        { $match: { month: currMonth } },
        { $group: {
            _id: null,
            total: { $sum: '$cost'}
            }
        }
    ]).exec().then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
    
});

router.post("/", (req, res, next) => {
    const spend = new Spending({
        _id: new mongoose.Types.ObjectId(),
        item: req.body.item,
        date: req.body.date,
        cost: req.body.cost
    });

    spend.save()
    .then(result => {
        res.status(200).json({
            message: 'Index page POST request',
            spend: result
        });
    })
    .catch(err => {
        console.log(err);
    });

});
module.exports = router;