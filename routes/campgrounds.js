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

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", checkCampgroundOwnership, (req,res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.render("campgrounds/edit", {campground:foundCampground});                
        }
    });
});

// UPDATE CAMPGROUND ROUTE

router.put("/:id", checkCampgroundOwnership, (req,res)=>{
    console.log(req.body.campground);
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DELETE CAMPGROUND ROUTE

router.delete("/:id", checkCampgroundOwnership, (req,res)=>{
    Campground.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCampground)=>{
            if(err){
                res.redirect("back");
            } else{
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else{
                    res.redirect("back")
                } 
            }
        });
    } else{
        res.redirect("back");
    }
}

module.exports = router;