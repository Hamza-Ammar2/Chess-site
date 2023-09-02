var express = require('express');
var router = express.Router();
const Match = require('../models/match');
const User = require('../models/users');

/* GET users listing. */
/*router.get('/', (req, res, next) => {
    User.find().exec((err, result) => {
        if (err) {return next(err);}
        res.render('allusers', { title: 'Leaderboard', users: result, user: req.user ? req.user : null });
    });
});*/

module.exports = router;
