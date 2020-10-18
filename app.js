/*********************************************************
VARIABLE DECLARATIONS
**********************************************************/
var express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
    mongoose     = require("mongoose"),
    passport     =require("passport"),
    LocalStrategy=require("passport-local"),
    Recipe     = require("./models/recipe"),
    Comment    = require("./models/comment"),
    User       =require("./models/user"),
    seedDB     = require("./seeds");
    
    
/*********************************************************
CONFIGURATIONS
**********************************************************/
//mongoose.connect("mongodb://localhost/recipes", { useUnifiedTopology: true, useNewUrlParser: true }); //Offline MongoDB
//please fill credentials in database/connections file
var connectDB = require("./database/Connection");
const { populate, updateOne } = require("./models/comment");
connectDB();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
seedDB();
 

/******************************************************************* 
PASSPORT CONFIGURATION
**********************************************************************/

//passport configuration
app.use(require("express-session")({
    secret: "Food that we love should be healthy and delicius too.",
    resave: false,
    saveUninitialized: false
}));
   
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



/*********************************************************
ROUTES
**********************************************************/
//ROOT ROUTE: landing page
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
            res.render("recipes/index", { recipes: allRecipes});
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
    res.render("recipes/new");
});

//SHOW ROUTE: shows more info about one recipe
app.get("/recipes/:id", function(req, res) {
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

/*********************************************************
COMMENT ROUTES
**********************************************************/
app.get("/recipes/:id/comments/new", isLoggedIn,function(req, res){
    //find recipe by id
    Recipe.findById(req.params.id, function(err, recipe){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {recipe: recipe});
        }
    })
});

app.post("/recipes/:id/comments", function(req, res) {
    //lookup reipe using id
    Recipe.findById(req.params.id, function(err, recipe) {
        if (err) {
            console.log(err);
            res.redirect("/recipes");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    recipe.comments.push(comment);
                    recipe.save();
                    res.redirect("/recipes/"+recipe._id);
                }
            });
        }
    });
    //create new comment
    //connect new comment to recipe
    //redirect to recipe show page
});
 


/*****************************************
 AUTH ROUTES
 */

//show register form
app.get("/register",function(req, res){
    res.render("register");
});

//HANDLE SIGN UP LOGIC
app.post("/register",function(req, res){
    var newUser= new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req, res,function(){
            res.redirect("/recipes");
        });
    });
});

 //SHOW LOGIN FORM
 app.get("/login",function(req,res){
     res.render("login");
 });

 //HANDLING LOGIN LOGIC
 
 app.post("/login",passport.authenticate("local",
 {
    successRedirect:"/recipes",
    failureRedirect:"/login"
 }) ,function(req,res){

});

//LOGIC ROUTE
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/recipes");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


//App Url
app.listen(3000,function(){
    console.log("The AppEtizer server has started");
});