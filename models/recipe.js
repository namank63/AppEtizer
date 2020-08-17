/*********************************************************
RECIPE SCHEMA
**********************************************************/
var mongoose = require("mongoose");

var recipeSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
       {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
       }
    ]
});

module.exports  = mongoose.model("Recipe", recipeSchema);