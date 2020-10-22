/*********************************************************
VARIABLE DECLARATIONS
**********************************************************/
var express = require("express");
var router = express.Router({mergeParams: true});
var Recipe = require("../models/recipe");
var Comment = require("../models/comment");



/*********************************************************
COMMENT ROUTES
**********************************************************/
//comments new
router.get("/new", isLoggedIn,function(req, res){
    //find recipe by id
    Recipe.findById(req.params.id, function(err, recipe){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {recipe: recipe});
        }
    })
});

//comment create
router.post("/", function(req, res) {
    //lookup reipe using id
    Recipe.findById(req.params.id, function(err, recipe) {
        if (err) {
            console.log(err);
            res.redirect("/recipes");
        } else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
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
                    //redirect to recipe show page
                    res.redirect("/recipes/"+recipe._id);
                }
            });
        }
    }); 
});

//Comments Edit
router.get("/:comment_id/edit", function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {recipe_id: req.params.id, comment: foundComment});
        }
    }); 
});

//Comment Update
router.put("/:comment_id", function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/recipes/" + req.params.id);
        }
    });
});



/*********************************************************
MIDDLEWARE
**********************************************************/
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;