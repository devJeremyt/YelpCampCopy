const express = require("express"),
      router = express.Router(),
      Campground = require("../models/campground");

//INDEX - shows all the campgrounds
router.get('/',(req,res)=>{
    Campground.find({}, (err, campgrounds)=>{
        if(err){
            console.log(err);
        } else{
           res.render('campgrounds/index', {campgrounds : campgrounds, currentUser: req.user});
        }
    });
});

//NEW - show form for adding campground
router.get('/new', isLoggedIn, (req, res)=>{
       res.render('campgrounds/new.ejs');
});

//SHOW - shows info for specific campground
router.get("/:id", (req,res)=>{
   Campground.findById(req.params.id).populate('comments').exec((err, foundCampground)=>{
       if(err){
           console.log(err);
       } else {
           res.render('campgrounds/show', {campground: foundCampground});
       }
   });
});

//CREATE - adds new campground
router.post('/', isLoggedIn, (req,res)=>{
   let name = req.body.name;
   let image = req.body.image;
   let description = req.body.description;
   let author = {
       id: req.user._id,
       username: req.user.username
   };
   let campground = {name: name, image: image, description: description, author:author};

   Campground.create(campground, (err,campground)=>{
       if(err){
           console.log(err);
       }else{
           console.log(campground);
           res.redirect('/campgrounds');
       }
   });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

module.exports = router;