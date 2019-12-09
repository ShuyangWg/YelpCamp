var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.checkOwnership = function checkOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function functionName(err, found) {
      if (err) {
        req.flash("error", "Cannot find this comment!")
        res.redirect('back');
      } else {
        if (found.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "Permission Denied!")
          res.redirect('back');
        }
      }
    })
  } else {
    req.flash("error", "Please Login First!")
    res.redirect('back');
  }
};

middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function functionName(err, found) {
      if (err) {
        req.flash("error", "Cannot find this comment!")
        res.redirect('back');
      } else {
        if (found.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "Permission Denied!")
          res.redirect('back');
        }
      }
    })
  } else {
      req.flash("error", "Please Login First!")
      res.redirect('back');
  }
}

middlewareObj.isLoggedIn = function isLoggedIn(req,res,next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error", "Please Login First!")
    res.redirect('/login');
  }
}


module.exports = middlewareObj
