const express = require("express"),
      router = express.Router({mergeParams: true}),
      Campground = require("../models/campground"),
      Comment = require("../models/comment"),
      middleware = require("../middleware");


//Shows form for new comment
router.get("/new", middleware.isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
    
});

//Creates new comment
router.post("/", middleware.isLoggedIn, (req,res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment)=>{
                if(err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id)
                }
            });
        }
    });
});

//SHOW UPDATE COMMENT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res)=>{
    Comment.findById(req.params.comment_id, (err, foundComment)=>{
        if(err){
            res.redirect("back");
        } else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
    
})

//UPDATE COMMENT

router.put("/:comment_id/edit", middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwnership,  (req, res)=>{
    Comment.findByIdAndRemove(req.params.comment_id, (err, foundComment)=>{
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;