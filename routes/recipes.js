/*********************************************************
VARIABLE DECLARATIONS
**********************************************************/
var express = require("express");
var router = express.Router();
var Recipe = require("../models/recipe");
var middleware = require("../middleware");



/*********************************************************
RECIPES ROUTES
**********************************************************/
//INDEX ROUTE: shows all recipes
router.get("/", function (req, res) {
    //Get all recipes from DB
    Recipe.find({}, function (err, allRecipes) {
        if (err) {
            console.log(err);
        } else {
            res.render("recipes/index", { recipes: allRecipes });
        }
    });
});

//Capitalize first letter of each word in recipe name
function RecipeNameFormat(name) {
    var formatedName = name[0].toUpperCase();
    for (var i = 1; i < name.length; i++) {
        if (name[i - 1] == ' ')
            formatedName += name[i].toUpperCase();
        else
            formatedName += name[i];
    }
    return formatedName;
}

function extractTags(tags) {
    var tagArray = [];
    tagArray = tags.split(' ');
    return tagArray;
}

//CREATE ROUTE: add new recipe to DB
router.post("/", middleware.isLoggedIn, function (req, res) {
    //get data from form and add to recpies array
    var name = req.body.name;
    name = RecipeNameFormat(name);
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var procedure = req.body.procedure;
    var tags = extractTags(req.body.tags);
    // var ingredients = 
    console.log(req.body.item);
    console.log(req.body.quantity);
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var ingredients = [];
    for(var i = 0; i < req.body.item.length; i++) {
        ingredients.push({item: req.body.item[i], quantity: req.body.quantity[i]});
    }
    var newRecpie = {
        name: name, price: price,
        image: image, description: description,
        author: author, procedure: procedure,
        tags: tags,
        ingredients: ingredients
    }
    //create a new recipe and save to DB
    Recipe.create(newRecpie, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect back to recpies page
            res.redirect("/recipes");
        }
    });
});

//NEW ROUTE: show form to create new recipe
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("recipes/new");
});

//SHOW ROUTE: shows more info about one recipe
router.get("/:id", function (req, res) {
    //find the recipe with provided ID
    Recipe.findById(req.params.id).populate("comments").exec(function (err, foundRecipe) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundRecipe);
            //render show template with that recipe
            res.render("recipes/show", { recipe: foundRecipe });
        }
    });
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkRecipeOwnerShip, function (req, res) {
    Recipe.findById(req.params.id, function (err, foundRecipe) {
        res.render("recipes/edit", { recipe: foundRecipe });
    });
});

//UPDATE ROUTE
router.put("/:id", middleware.checkRecipeOwnerShip, function (req, res) {
    //find and update the correct recipe
    Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function (err, updatedRecipe) {
        if (err) {
            res.redirect("/recipes");
        } else {
            //rediect to show page
            res.redirect("/recipes/" + req.params.id);
        }
    });
});

//DESTROY ROUTE
router.delete("/:id", middleware.checkRecipeOwnerShip, function (req, res) {
    Recipe.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/recipes");
        } else {
            res.redirect("/recipes");
        }
    })
});

module.exports = router;