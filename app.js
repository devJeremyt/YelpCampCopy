const express = require('express'),
    app = express(),
    request = require('request'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true });


// Schema Setup

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

Campground.create(
    {name: "Salmon Creek", image:"https://farm5.staticflickr.com/4191/34533125526_716102b23f_m.jpg"},
    function(err, campground){
        if(err){
            console.log(err);
        } else{
            console.log(campground.name + " was create.");
        }
    }
);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get('/', (req,res)=>{
	res.render('landing');
});

app.get('/campgrounds',(req,res)=>{
	 Campground.find({}, (err, campgrounds)=>{
         if(err){
             console.log(err);
         } else{
            res.render('campgrounds', {campgrounds : campgrounds});
         }
     });
});

app.get('/campgrounds/new', (req, res)=>{
        res.render('new.ejs');
});

app.post('/campgrounds', (req,res)=>{
    let name = req.body.name;
    let image = req.body.image;
    let campground = {name: name, image: image};
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