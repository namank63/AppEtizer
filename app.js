//  const recipe = require("./models/recipe");

/*********************************************************
VARIABLE DECLARATIONS
**********************************************************/
var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    recipe     = require("./models/recipe"),
    // comment    = require("./models/comment"),
    seedDB     = require("./seeds")


    
/*********************************************************
CONFIGURATIONS
**********************************************************/
mongoose.connect("mongodb://localhost/recipes", { useUnifiedTopology: true, useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine","ejs");


seedDB();


/*********************************************************
ROUTES
**********************************************************/
app.get("/", function(req,res){
    res.render("landing");
});

//INDEX ROUTE: shows all recipes
app.get("/recipes", function(req,res){
    //Get all recipes from DB
    recipe.find({}, function(err, allRecipes){
        if(err) {
            console.log(err);
        } else {
            res.render("index", { recipes: allRecipes});
        }
    });
});

//CREATE ROUTE: add new recipe to DB
app.post("/recipes", function(req, res){
    //get data from form and add to recpies array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newRecpie = {name: name, image: image, description: description}
    //create a new recipe and save to DB
    recipe.create(newRecpie, function(err, newlyCreated){
        if(err) {
            console.log(err);
        } else {
            //redirect back to recpies page
            res.redirect("/recipes");
        }
    });
});

//NEW ROUTE: show form to create new recipe
app.get("/recipes/new",function(req,res){
    res.render("new.ejs");
});

//SHOW ROUTE: shows more info about one recipe
app.get("/recipes/:id", function(req, res) {
    //find the recipe with provided ID
    recipe.findById(req.params.id).populate(comments).exec( function(err, foundRecipe){
        if(err) {
            console.log(err);
        } else {
             console.log(foundRecipe);
            //render show template with that recipe
            res.render("show", {recipe: foundRecipe});
        }
    });
});
 
app.listen(3000,function(){
    console.log("The AppEtizer server  has started");
});