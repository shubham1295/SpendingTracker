const express = require('express');
const router = express.Router();
const Spending = require('../models/spending');

// router.get("/", (req, res, next) => {

//     res.status(200).render('date', {item: ""});

// });


//sample URL    http://localhost:3000/date?sdate=2019-06-02&edate=2019-06-30
router.get("/", (req, res, next) => {
    var sdate = GetFormattedDate(req.query.sdate);
    var edate = GetFormattedDate(req.query.edate);

    if (sdate == "" && edate == "") {
        res.status(200).render('date', { item: "" });
    } else {
        console.log(sdate, ":", edate)
        if (req.query.edate != "") {
            
            Spending.aggregate([
                { $match: {date: { $gte: new Date(sdate) , $lte: new Date(edate)}} },
                {
                    $group: {
                        _id: "$_id",
                        item: { $first: '$item' },
                        cost: { $first: '$cost' },
                        date: { $first: '$date' },
                    }
                },
                { $project: {
                        item: true,
                        cost: true,
                        date: { $dateToString: { format: "%d/%m/%G",date: "$date" } }
                    }
                },
                { $sort: { date: -1 } }
            ]).then(result => {
                // res.status(200).json({
                //     message: result
                // });
                res.status(200).render('date', { item: result });
                // console.log("HEREE",result);
            })
            .catch(err => {
                console.log(err);
            });

        } else {

            Spending.aggregate([
                { $match: {date: { $gte: new Date(sdate) }} },
                {
                    $group: {
                        _id: "$_id",
                        item: { $first: '$item' },
                        cost: { $first: '$cost' },
                        date: { $first: '$date' },
                    }
                },
                { $project: {
                        item: true,
                        cost: true,
                        date: { $dateToString: { format: "%d/%m/%G",date: "$date" } }
                    }
                },
                { $sort: { date: -1 } }
            ]).then(result => {
                // res.status(200).json({
                //     message: result
                // });
                // date = GetFormattedDate(result.date);
                res.status(200).render('date', { item: result });
                // console.log("HEREE",result);
            })
            .catch(err => {
                console.log(err);
            });
        }
    }
});

function GetFormattedDate(date) {
    if (date != null) {
        var fields = date.split('/');

        var day = fields[0];
        var month = fields[1];
        var year = fields[2];

        date = year + '-' + month + '-' + day;
        return date;
    }
    return "";
}

module.exports = router;