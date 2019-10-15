const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
let campgrounds = [
    {name: "Salmon Creek", image:"https://farm5.staticflickr.com/4191/34533125526_716102b23f_m.jpg"},
    {name: "Granite Hill", image: "https://live.staticflickr.com/3140/2691212255_f292f02fa9_m.jpg"},
    {name: " Mountain Goat's Rest", image: "https://live.staticflickr.com/8456/7986308414_53e55712a2_m.jpg"}
];

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get('/', (req,res)=>{
	res.render('landing');
});

app.get('/campgrounds',(req,res)=>{
	 
	 
	 res.render('campgrounds', {campgrounds : campgrounds});
});

app.get('/campgrounds/new', (req, res)=>{
        res.render('new.ejs');
});

app.post('/campgrounds', (req,res)=>{
    let name = req.body.name;
    let image = req.body.name;
    let campground = {name: name, image: image};
    campgrounds.push(campground);

    res.redirect('/campgrounds');
});


app.listen(3000, ()=>{
	console.log('Server is running');
});