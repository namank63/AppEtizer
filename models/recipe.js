/*********************************************************
RECIPE SCHEMA
**********************************************************/
var mongoose = require("mongoose");

var recipeSchema = new mongoose.Schema({
    name: String,
    price:String,
    image: String,
    description: String,
    ingredients: String,
    procedure: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
       {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
       }
    ]
});

module.exports  = mongoose.model("Recipe", recipeSchema);