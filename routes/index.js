var express = require('express');
var router = express.Router();
const Match = require('../models/match');
const User = require('../models/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Chess', user: req.user ? req.user : null});
});


router.get('/leaderboard', (req, res, next) => {
  User.find().sort({rank: -1}).exec((err, result) => {
      if (err) {return next(err);}
      res.render('allusers', { title: 'Leaderboard', users: result, user: req.user ? req.user : null });
  });
});


router.get("/all-matches", (req, res, next) => {
  Match.find().exec((err, result) => {
    if (err) {return next(err);}

    res.render("all-matches", {title: "All matches", matches: result.reverse(), user: req.user ? req.user : null});
  });
});

router.post('/log-out', (req, res, next) => {
  req.logOut((err) => {
    if (err) {return next(err);}

    res.redirect('/');
  });
});


router.get('/sign-up', (req, res, next) => {
  res.render("sign-up", {title: "Sign-up", message: req.session.message, eh: "esoijd"});
});



router.get('/log-in', (req, res, next) => {
  res.render("log-in", {title: "Log-in", message: req.session.message, eh: "ospjef"});
});

router.get('/local', (req, res, next) => {
  res.render("local", {title: "Local", user: req.user ? req.user : null});
});


router.get('/ai', (req, res, next) => {
  res.render("ai", {title: "Computer", user: req.user ? req.user : null});
});


router.get('/:mode/ranked', (req, res, next) => {
  if (!req.user) {return res.redirect('/log-in')}
  res.render("match", {title: req.params.mode + " ranked", user: req.user, mode: req.params.mode, ranked: true});
});

router.get('/:mode/guest', (req, res, next) => {
  res.render("match", {title: req.params.mode, mode: req.params.mode, user: null, ranked: false});
});



router.get('/matches/:id', (req, res, next) => {
  Match.findById(req.params.id).exec((err, result) => {
    if (err) {return next(err);}

    res.render("review-match", {title: "Match", match: result, user: req.user ? req.user : null});
  });
});


router.get('/:id', (req, res, next) => {
  User.findById(req.params.id).populate('matches').exec((err, result) => {
    if (err) {return next(err);}
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
