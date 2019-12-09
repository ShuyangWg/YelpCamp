var express = require("express");
const router = express.Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middleware = require("../middleware");

router.get('/new', middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, function functionName(err, campground) {
    if (err) {
      req.flash("error", "Something went wrong");
      console.log(err);
    } else {
      res.render("comments/new",{campground:campground});
    }
  })
});

router.post('/', middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, function functionName(err, campground) {
    if (err) {
        console.log(err);
        res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, function functionName(err, comment) {
          if (err) {
            console.log(err);
          } else {
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();

            campground.comments.push(comment);
            campground.save();
            res.redirect('/campgrounds/' + campground._id);
          }
      })
    }
  })
});

// Edit
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, function functionName(err, foundComment) {
    if (err) {
      res.redirect('back');
    } else {
      res.render("comments/edit", {campground_id:req.params.id, comment: foundComment});
    }
  })
});

// Update
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function functionName(err, updated) {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  })
});

// Destroy
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, function functionName(err) {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});



function isLoggedIn(req,res,next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

module.exports = router;
