var express = require("express");
const router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get('/', function(req, res) {
  Campground.find({},function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
      res.render("campgrounds/campgrounds",{campgrounds:allCampgrounds});
    }
  })

  //res.render("campgrounds", {campgrounds:c});
});

router.post('/', middleware.isLoggedIn, (req, res) => {
  //get data from form
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;

  var author = {
    id: req.user._id,
    username: req.user.username
  };

  var newc = {name:name,image:image,description:description,author:author};
  // console.log(name,image);

  Campground.create(newc, function(err, newlyCreated){
    if (err) {
      console.log(err);
    } else {
      //redirect back to campground page
      res.redirect('/campgrounds');
    }
  })
});

router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.get('/:id', (req, res) => {
  Campground.findById(req.params.id).populate("comments").exec(function(err, found){
    if (err) {
      console.log(err);
    } else {
      console.log(found);
      res.render("campgrounds/show", {campground:found});
    }
  })
});

// EDIT data
router.get('/:id/edit', middleware.checkOwnership, (req, res) => {
    Campground.findById(req.params.id, function functionName(err, found) {
          res.render("campgrounds/edit", {campground: found})
    });
});

// UPDATE DATA
router.put('/:id', middleware.checkOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function functionName(err, updated) {
    if (err) {
        res.redirect('/campgrounds');
    } else {
        res.redirect('/campgrounds/' + req.params.id);
    }
  })
});

// Delete
router.delete('/:id', middleware.checkOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, function functionName(err) {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds');
    }
  })
});



module.exports = router;
