var express = require("express");
const router = express.Router();

var passport = require("passport");
var User = require("../models/user");

router.get('/register', (req, res) => {
  res.render("register");
});

router.post('/register', (req, res) => {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function functionName(err, user) {
    if (err) {
        console.log(err);
        return res.render("register",{"error": err.message});
    } else {
      passport.authenticate("local")(req,res,function(){
        req.flash("success", "Welcome to YelpCamp " + user.username)
        res.redirect('/campgrounds');
      })
    }
  });
});

router.get('/login', (req, res) => {
  res.render("login");
});

router.post('/login', passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }) ,(req, res) => {

});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash("success", "Logged out!")
  res.redirect('/campgrounds');
});

function isLoggedIn(req,res,next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

module.exports = router;
