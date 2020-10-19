/*********************************************************
VARIABLE DECLARATIONS
**********************************************************/
var express = require("express");
var router = express.Router();
var Recipe = require("../models/recipe");



/*********************************************************
RECIPES ROUTES
**********************************************************/
//INDEX ROUTE: shows all recipes
router.get("/", function(req,res){
    //Get all recipes from DB
    Recipe.find({}, function(err, allRecipes){
        if(err) {
            console.log(err);
        } else {
            res.render("recipes/index", { recipes: allRecipes});
        }
    });
});

//CREATE ROUTE: add new recipe to DB
router.post("/", isLoggedIn, function(req, res){
    //get data from form and add to recpies array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newRecpie = {name: name, image: image, description: description, author: author}
    //create a new recipe and save to DB
    Recipe.create(newRecpie, function(err, newlyCreated){
        if(err) {
            console.log(err);
        } else {
            //redirect back to recpies page
            res.redirect("/recipes");
        }
    });
});

//NEW ROUTE: show form to create new recipe
router.get("/new", isLoggedIn, function(req,res){
    res.render("recipes/new");
});

//SHOW ROUTE: shows more info about one recipe
router.get("/:id", function(req, res) {
    //find the recipe with provided ID
    Recipe.findById(req.params.id).populate("comments").exec( function(err, foundRecipe){
        if(err) {
            console.log(err);
        } else {
             console.log(foundRecipe);
            //render show template with that recipe
            res.render("recipes/show", {recipe: foundRecipe});
        }
    });
});

//EDIT ROUTE
router.get("/:id/edit", function(req, res){
    Recipe.findById(req.params.id, function(err, foundRecipe){
        if(err) {
            res.redirect("/recipes");
        } else {
            res.render("recipes/edit", {recipe: foundRecipe});
        }
    });
});

//UPDATE ROUTE
router.put("/:id", function(req, res){
    //find and update the correct recipe
    Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(err, updatedRecipe){
        if(err) {
            res.redirect("/recipes");
        } else {
            //rediect to show page
            res.redirect("/recipes/" + req.params.id);
        }
    });
});

//DESTROY ROUTE
router.delete("/:id", function(req, res){
    Recipe.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect("/recipes");
        } else {
            res.redirect("/recipes");
        }
    })
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