/*********************************************************
VARIABLE DECLARATIONS
**********************************************************/
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Recipe          = require("./models/recipe"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");
    
    
    
/*********************************************************
REQUIRING ROUTES
**********************************************************/
var commentRoutes = require("./routes/comments"),
    recipeRoutes  = require("./routes/recipes"),
    indexRoutes   = require("./routes/index");
    
    
    
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
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database



/********************************************************** 
PASSPORT CONFIGURATION
**********************************************************/
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

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error     = req.flash("error");
    res.locals.success    = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/recipes", recipeRoutes);
app.use("/recipes/:id/comments", commentRoutes);



/***********************************************************
 SERVER 
***********************************************************/
app.listen(3000,function(){
    console.log("The AppEtizer server has started");
});