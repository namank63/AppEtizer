/*********************************************************
VARIABLE DECLARATIONS
**********************************************************/
var express = require("express");
var router = express.Router({mergeParams: true});
var Recipe = require("../models/recipe");
var Comment = require("../models/comment");
var middleware = require("../middleware");



/*********************************************************
COMMENT ROUTES
**********************************************************/
//comments new
router.get("/new", middleware.isLoggedIn,function(req, res){
    //find recipe by id
    Recipe.findById(req.params.id, function(err, recipe){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {recipe: recipe});
        }
    })
});

//Comment Create
router.post("/", middleware.isLoggedIn, function(req, res) {
    //lookup recipe using id
    Recipe.findById(req.params.id, function(err, recipe) {
        if (err) {
            console.log(err);
            res.redirect("/recipes");
        } else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    req.flash("error", "something went wrong");
                    console.log(err);
                } else {
                    //add username and id to cpmment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    //connect new comment to recipe
                    recipe.comments.push(comment);
                    recipe.save();
                    req.flash("success", "Successfully added comments");
                    //redirect to recipe show page
                    res.redirect("/recipes/"+recipe._id);
                }
            });
        }
    }); 
});

//Comment Edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {recipe_id: req.params.id, comment: foundComment});
        }
    }); 
});

//Comment Update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/recipes/" + req.params.id);
        }
    });
});

//Comment Destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success","Comment deleted");
            res.redirect("/recipes/" + req.params.id);
        }
    });
});

module.exports = router;