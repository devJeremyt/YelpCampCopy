const express = require('express'),
    app = express(),
    request = require('request'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    seedDB = require('./seeds');

//Setup
seedDB();
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


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
            res.render('index', {campgrounds : campgrounds});
         }
     });
});

//NEW - show form for adding campground
app.get('/campgrounds/new', (req, res)=>{
        res.render('new.ejs');
});

//SHOW - shows info for specific campground
app.get("/campgrounds/:id", (req,res)=>{
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground)=>{
        if(err){
            console.log(err);
        } else {
            res.render('show', {campground: foundCampground});
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


app.listen(3000, ()=>{
	console.log('Server is running');
});