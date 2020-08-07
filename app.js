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
    image: String
});

var Recipe = mongoose.model("Recipe", recipeSchema);

// Recipe.create(
//     { 
//         name: "Italian Pasta", 
//         image: "https://1.bp.blogspot.com/-0IwBC-Wltc8/W8_d-FuHaXI/AAAAAAAAC0o/wm0Hs1FmHjklNnUlXoCCmtbqnpqlwv1fQCLcBGAs/s1600/World%2BPasta%2BDay%2B2018.jpg"
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

app.get("/recipes", function(req,res){
    //Get all recipes from DB
    Recipe.find({}, function(err, allRecipes){
        if(err) {
            console.log(err);
        } else {
            res.render("recipes", { recipes: allRecipes});
        }
    });
});

app.post("/recipes", function(req, res){

});

app.get("/recipes/new",function(req,res){
    res.render("new.ejs");
});
 
app.listen(3000,function(){
    console.log("The AppEtizer server  has started");
});