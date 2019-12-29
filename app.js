const express = require('express'),
    app = express(),
    request = require('request'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    seedDB = require('./seeds');

//Setup
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
//Run if you need to clear DB and reseed with a few campgrounds
//seedDB();


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
            res.render('campgrounds/index', {campgrounds : campgrounds});
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

// Comment new
app.get("/campgrounds/:id/comment/new", (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
    
});

app.post("/campgrounds/:id/comment", (req,res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            console.log(err);
            res.redirect("/campground");
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

app.listen(3000, ()=>{
	console.log('Server is running');
});