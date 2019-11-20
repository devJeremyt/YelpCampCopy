const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');

const data = [
    {
        name: 'Brice Creek',
        image:'https://live.staticflickr.com/6079/6050644771_ae8c5569d0_m.jpg',
        description: 'The Brice Creek Experiment'
    },
    {
        name: "Mountain Goat's Rest",
        image:'https://live.staticflickr.com/3140/2691212255_f292f02fa9_m.jpg',
        description: 'Goats rest on mountains'
    },
    {
        name: 'Granite Hill',
        image:'https://live.staticflickr.com/8456/7986308414_53e55712a2_m.jpg',
        description: 'Just a hill of Granite'
    }
]

function seedDB(){

    //Remove all campgrounds
    Campground.deleteMany({}, (err)=>{
        if(err){
            console.log(err)
        }
        console.log('Removed campgrounds')
        
        //Add a few Campgrounds
        data.forEach((seed)=>{
            Campground.create(seed, (err, campground)=>{
                if(err){
                    console.log(err);
                } else{
                    console.log('Campground Added');

                    //Create a comment
                    Comment.create({text: "This is an awesome place. Wish I had internet though", author: "George"}, (err, comment)=>{
                        if(err){
                            console.log(err);
                        } else{
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created new Comment");
                        }
                    });
                };
            });
        });
    });

    //Add comments
}

module.exports = seedDB;
