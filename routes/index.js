const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Spending = require('../models/spending');

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


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
        if(result.length == 0){
            //If result is null set total amount to 0
            result = [{_id: null, total: 0}];
        }
        console.log(result);
        // res.status(200).json(result);
        res.status(200).render('index', { total: result, month: monthNames[currMonth], year: currentDate.getFullYear()});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });

});

router.post("/", (req, res, next) => {
    var bodyDate = GetFormattedDate(req.body.date); //Remove this to work on postman

    const spend = new Spending({
        _id: new mongoose.Types.ObjectId(),
        item: req.body.item,
        date: bodyDate,
        cost: req.body.cost
    });

    // Format Selected Date by +1
    // spend.date.setDate(spend.date.getDate() +1);
    spend.date.setDate(spend.date.getDate());
    spend.save()
    .then(result => {
        // res.status(200).json({
        //     message: 'Index page POST request',
        //     spend: result
        // });
        console.log(result);
        res.redirect('/');          //temp fix
    })
    .catch(err => {
        console.log(err);
    });


    // res.status(200).json({
    //     message: 'Index page POST request',
    //     spend: spend
    // });

});


//sample URL    http://localhost:3000/date?sdate=2019-06-02&edate=2019-06-30
router.get("/date", (req, res, next) => {

    // res.status(200).json({
    //     message:  req.query.sdate
    // });

    // Spending.find({
    //     date: { $gte: req.query.sdate, $lte: new Date() }
    // })
    // .then(result => {
    //     res.status(200).json({
    //         message: result
    //     });
    // })
    // .catch(err => {
    //     console.log(err);
    // });

    if(req.query.edate != ""){
        Spending.find({
            date: { $gte: req.query.sdate, $lte: req.query.edate }
        })
        .then(result => {
            // res.status(200).json({
            //     message: result
            // });
            res.status(200).render('date', { result: result });
        })
        .catch(err => {
            console.log(err);
        });
    }else{
        Spending.find({
            date: { $gte: req.query.sdate, $lte: new Date() }
        })
        .then(result => {
            // res.status(200).json({
            //     message: result
            // });
            // res.send({result: result})
            res.status(200).render('date', { result: result });
        })
        .catch(err => {
            console.log(err);
        });
    }
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
