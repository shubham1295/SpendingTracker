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
        // res.status(200).json(result);
        res.status(200).render('index', { total: result });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });

});

router.post("/", (req, res, next) => {
    var bodyDate = new Date();
    bodyDate = GetFormattedDate(req.body.date);

    const spend = new Spending({
        _id: new mongoose.Types.ObjectId(),
        item: req.body.item,
        date: bodyDate,
        cost: req.body.cost
    });

    //Format Selected Date by +1
    spend.date.setDate(spend.date.getDate() +1);
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

function GetFormattedDate(mydate) {
    var fields = mydate.split('/');

    var day = fields[0];
    var month = fields[1];
    var year = fields[2];

    date= year+-+month+-+day;
    return date
}