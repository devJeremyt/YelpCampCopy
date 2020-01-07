const express = require('express'),
    app = express(),
    request = require('request'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    seedDB = require('./seeds'),
    passport = require("passport"),
    LocalStrategy = require("passport-local")
    User = require("./models/user");

//Setup
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})
//Run if you need to clear DB and reseed with a few campgrounds
//seedDB();

//Passport Configuration
app.use(require("express-session")({
    secret: "Random sentence",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Landing Page
app.get('/', (req,res)=>{
	res.render('landing');
});


//INDEX - shows all the campgrounds
app.get('/campgrounds',(req,res)=>{
	 Campground.find({}, (err, campgrounds)=>{
         if(err){
             console.log(err);
         } else{
            res.render('campgrounds/index', {campgrounds : campgrounds, currentUser: req.user});
         }
     });
});

//NEW - show form for adding campground
app.get('/campgrounds/new', (req, res)=>{
        res.render('campgrounds/new.ejs');
});

//SHOW - shows info for specific campground
app.get("/campgrounds/:id", (req,res)=>{
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground)=>{
        if(err){
            console.log(err);
        } else {
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

//CREATE - adds new campground
app.post('/campgrounds', (req,res)=>{
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let campground = {name: name, image: image, description: description};
    Campground.create(campground, (err,campground)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/campgrounds');
        }
    });

    
});

// New Comment - Shows form for new comment
app.get("/campgrounds/:id/comment/new", isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
    
});

// New Comment - Creates new comment
app.post("/campgrounds/:id/comment", isLoggedIn, (req,res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment)=>{
                if(err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id)
                }
            });
        }
    });
});

// Authentication Routes

//Show register form
app.get("/register", (req,res)=>{
    res.render("register");
});

app.post("/register", (req,res)=>{
    let user = new User({username: req.body.username});
    User.register(user, req.body.password, (err, user)=>{
        if(err){
            console.log(err);
            return res.render("/register");
        }
        passport.authenticate("local")(req, res, ()=>{
            res.redirect("/campgrounds");
        });
    })
});

//SHOW LOGIN FORM
app.get("/login", (req,res)=>{
    res.render("login");
});

//HANDLING LOGIN LOGIC
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }), (reg, res)=>{
    
});

// LOGOUT ROUTE
app.get("/logout", (req, res)=>{
    req.logOut();
    res.redirect("/campgrounds");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

app.listen(3000, ()=>{
	console.log('Server is running');
});