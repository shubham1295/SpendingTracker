const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Sugar = require('sugar');
const Spending = require('../models/spending');
const Category = require('../models/category');

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];


router.get("/", (req, res, next) => {

    var currentDate = new Date();
    var currMonth = currentDate.getMonth() + 1;

    // res.status(200).json({
    //     message: month,
    // });

    GetQuery(Spending, function (result, test) {
        // console.log(result,test);
        var totalExp = formatMoney(result[0].total);

        Category.find({}, { _id: 0, description: 0 })
            .then(out => {
                // console.log(out);
                res.status(200).render('index', {
                    total: totalExp,
                    item: test,
                    month: monthNames[currMonth],
                    year: currentDate.getFullYear(),
                    category: out
                });
            }).catch(err => {
                console.log(err);
            });

    });

});

router.post("/", (req, res, next) => {
    var bodyDate = GetFormattedDate(req.body.date);
    const spend = new Spending({
        _id: new mongoose.Types.ObjectId(),
        item: req.body.item,
        date: bodyDate,
        cost: req.body.cost,
        category: req.body.category
    });

    spend.save().then(result => {
        // res.status(200).json({
        //     message: 'Index page POST request',
        //     spend: result
        // });
        // res.send(result);
        // console.log(result);

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ result }, null, 3));

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
// router.get("/date", (req, res, next) => {

//     // res.status(200).json({
//     //     message:  req.query.sdate
//     // });

//     // Spending.find({
//     //     date: { $gte: req.query.sdate, $lte: new Date() }
//     // })
//     // .then(result => {
//     //     res.status(200).json({
//     //         message: result
//     //     });
//     // })
//     // .catch(err => {
//     //     console.log(err);
//     // });

//     sdate = GetFormattedDate(req.query.sdate);
//     edate = GetFormattedDate(req.query.edate);
//     console.log(sdate, ":", edate)
//     if(req.query.edate != ""){
//         Spending.find({
//             date: { $gte: sdate, $lte: edate }
//         })
//         .then(result => {
//             // res.status(200).json({
//             //     message: result
//             // });
//             // date = GetFormattedDate(result.date);
//             res.status(200).render('date', { result: result });
//         })
//         .catch(err => {
//             console.log(err);
//         });


//         // Spending.aggregate([
//         //     { $project: {
//         //             item: true,
//         //             cost: true,
//         //             date: { $dateToString: { format: "%d/%m/%G",date: "$date" } }
//         //         }
//         //     },
//         //     { $match: {date: { $gte: sdate }} }
//         // ]).then(result => {
//         //     // res.status(200).json({
//         //     //     message: result
//         //     // });
//         //     // date = GetFormattedDate(result.date);
//         //     res.status(200).render('date', { result: result });
//         // })
//         // .catch(err => {
//         //     console.log(err);
//         // });
//     }else{
//         Spending.find({
//             date: { $gte: sdate, $lte: new Date() }
//         })
//         .then(result => {
//             // res.status(200).json({
//             //     message: result
//             // });
//             // res.send({result: result})
//             res.status(200).render('date', { result: result });
//         })
//         .catch(err => {
//             console.log(err);
//         });
//     }
// });

router.get("/price", (req, res, next) => {
    GetQuery(Spending, function (result, test) {
        // console.log(result,test);
        var totalExp = formatMoney(result[0].total);
        // res.status(200).render('test', { total: totalExp, item: test, month: monthNames[currMonth], year: currentDate.getFullYear()});
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ totalExp, test }, null, 3));
        console.log(totalExp, test);
    });
});

router.get('/search_item/:category', (req, res, next) => {

    // Spending.distinct("item", { category: req.params.category })             //Temp till i collect data
    Spending.distinct('item')
        .then(result => {
            res.status(200).json({
                message: result
            });
        })
        .catch(err => {
            console.log(err);
        });
});

// router.get('/test', (req, res, next) => {
//     res.status(200).render('monthlyGraph');
// });

module.exports = router;

function GetFormattedDate(date) {
    var fields = date.split('/');

    var day = fields[0];
    var month = fields[1];
    var year = fields[2];

    date = year + '-' + month + '-' + day;
    return date;
}

function GetQuery(Spending, callback) {
    var currentDate = new Date();
    var currMonth = currentDate.getMonth() + 1;

    Spending.aggregate([
        { $project: { month: { $month: '$date' }, cost: true } },
        { $match: { month: currMonth } },
        {
            $group: {
                _id: null,
                total: { $sum: '$cost' }
            }
        }
    ]).exec().then(result => {
        if (result.length == 0) {
            //If result is null set total amount to 0
            result = [{ _id: null, total: 0 }];
        }

        // console.log("test",Sugar.Date.format(new Date(), '%Y-%m-%d'));
        Spending.aggregate([
            { $match: { date: { $gte: new Date(Sugar.Date.format(new Date(), '%Y-%m-%d')) } } },
            {
                $group: {
                    _id: "$_id",
                    item: { $first: '$item' },
                    cost: { $first: '$cost' },
                    date: { $first: '$date' },
                }
            },
            {
                $project: {
                    _id: true,
                    item: true,
                    cost: true,
                    date: { $dateToString: { format: "%d/%m/%G", date: "$date" } }
                }
            }
        ]).then(test => {
            // console.log(test,result);
            // res.status(200).render('test', { total: result, item: test, month: monthNames[currMonth], year: currentDate.getFullYear()});
            // if("development" === process.env.NODE_ENV){
            //     res.status(200).render('test', { total: result, item: test, month: monthNames[currMonth], year: currentDate.getFullYear()});
            // }
            // else {
            //     res.status(200).render('index', { total: result, item: test, month: monthNames[currMonth], year: currentDate.getFullYear()});
            // }
            callback(result, test);
        }).catch(err => {
            console.log(err);
            // res.status(500).json(err);
            callback(err);
        });

    })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
}


function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e)
    }
};