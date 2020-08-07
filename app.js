/*********************************************************
VARIABLE DECLARATIONS
**********************************************************/
var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose");


/*********************************************************
CONFIGURATIONS
**********************************************************/
mongoose.connect("mongodb://localhost/recipes", { useUnifiedTopology: true, useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine","ejs");


/*********************************************************
SCHEMA SETUP
**********************************************************/
var recipeSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

//compiling schema into model
var Recipe = mongoose.model("Recipe", recipeSchema);

// Recipe.create(
//     { 
//         name: "Italian Pasta", 
//         image: "https://1.bp.blogspot.com/-0IwBC-Wltc8/W8_d-FuHaXI/AAAAAAAAC0o/wm0Hs1FmHjklNnUlXoCCmtbqnpqlwv1fQCLcBGAs/s1600/World%2BPasta%2BDay%2B2018.jpg",
//         description: "It is a awesome italian Pasta"
//     },  function(err, recipe){
//         if(err) {
//             console.log(err);
//         } else {
//             console.log("New Recipe Saved!!");
//             console.log(recipe);
//         }
//     });


/*********************************************************
ROUTES
**********************************************************/
app.get("/", function(req,res){
    res.render("landing");
});

//INDEX ROUTE: shows all recipes
app.get("/recipes", function(req,res){
    //Get all recipes from DB
    Recipe.find({}, function(err, allRecipes){
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
app.get("/recipes/new",function(req,res){
    res.render("new.ejs");
});

//SHOW ROUTE: shows more info about one recipe
app.get("/recipes/:id", function(req, res) {
    //find the recipe with provided ID
    Recipe.findById(req.params.id, function(err, foundRecipe){
        if(err) {
            console.log(err);
        } else {
            //render show template with that recipe
            res.render("show", {recipe: foundRecipe});
        }
    });
});
 
app.listen(3000,function(){
    console.log("The AppEtizer server  has started");
});