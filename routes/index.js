const express = require("express");
      router = express.Router(),
      passport = require("passport");
      User = require("../models/user");

//Landing Page
router.get('/', (req,res)=>{
	res.render('landing');
});

// Authentication Routes
//Show register form
router.get("/register", (req,res)=>{
    res.render("register");
});

router.post("/register", (req,res)=>{
    let user = new User({username: req.body.username});
    User.register(user, req.body.password, (err, user)=>{
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, ()=>{
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    })
});

//SHOW LOGIN FORM
router.get("/login", (req,res)=>{

    res.render("login");
});

//HANDLING LOGIN LOGIC
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }), (reg, res)=>{
    
});

// LOGOUT ROUTE
router.get("/logout", (req, res)=>{
    req.logOut();
    req.flash("success", "Logged you out!")
    res.redirect("/campgrounds");
});

module.exports = router;