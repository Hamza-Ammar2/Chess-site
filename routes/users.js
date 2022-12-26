var express = require('express');
var router = express.Router();
var User = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find().sort({rank: -1}).exec((err, result) => {
    if (err) {return next(err);}
    res.render("allusers", {title: "Leaderboard", users: result, user: req.user ? req.user : null});
  });
});

module.exports = router;
