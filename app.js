const express = require('express'),
    app = express(),
    request = require('request'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true });


// Schema Setup

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);



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
            res.render('index', {campgrounds : campgrounds});
         }
     });
});

app.get('/campgrounds/new', (req, res)=>{
        res.render('new.ejs');
});

app.get("/campgrounds/:id", (req,res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if(err){
            console.log(err);
        } else {
            res.render('show', {campground: foundCampground});
        }
    });
});

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