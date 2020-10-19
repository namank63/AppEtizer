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
router.post("/", function(req, res){
    //get data from form and add to recpies array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newRecpie = {name: name, image: image, description: description}
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
router.get("/new",function(req,res){
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

module.exports = router;