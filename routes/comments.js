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

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;