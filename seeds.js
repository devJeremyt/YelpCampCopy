const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');

const data = [
    {
        name: 'Brice Creek',
        image:'https://live.staticflickr.com/6079/6050644771_ae8c5569d0_m.jpg',
        description: "It’s about making placeholder text great again. That’s what people want, they want placeholder text to be great again. Lorem Ipsum is the single greatest threat. We are not - we are not keeping up with other websites. An ‘extremely credible source’ has called my office and told me that Barack Obama’s placeholder text is a fraud. Lorem Ipsum's father was with Lee Harvey Oswald prior to Oswald's being, you know, shot."
    },
    {
        name: "Mountain Goat's Rest",
        image:'https://live.staticflickr.com/3140/2691212255_f292f02fa9_m.jpg',
        description: "My text is long and beautiful, as, it has been well documented, are various other parts of my website. The other thing with Lorem Ipsum is that you have to take out its family. I will write some great placeholder text – and nobody writes better placeholder text than me, believe me – and I’ll write it very inexpensively. I will write some great, great text on your website’s Southern border, and I will make Google pay for that text. Mark my words."
    },
    {
        name: 'Granite Hill',
        image:'https://live.staticflickr.com/8456/7986308414_53e55712a2_m.jpg',
        description: "Despite the constant negative ipsum covfefe. Does everybody know that pig named Lorem Ipsum? She's a disgusting pig, right? I know words. I have the best words. We are going to make placeholder text great again. Greater than ever before."
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
