var express = require('express');
var router = express.Router();
var User = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find().sort({rank: -1}).exec((err, result) => {
    if (err) {return next(err);}
    console.log("what")
    res.render("allusers", {title: "Leaderboard", users: result, user: req.user ? req.user : null});
  });
});


router.get('/:id', (req, res, next) => {
  User.findById(req.params.id).populate('matches').exec((err, result) => {
    let wins = 0;
    let losses = 0;
    let draws = 0;

    result.matches.forEach(match => {
      if (match.winner === result.username) {
        wins++;
      } else if (match.draw) {
        draws++;
      } else losses++;
    });


    res.render("user", {title: result.username, user: req.user ? req.user : null, person: result, losses, wins, draws});
  });
});

module.exports = router;
