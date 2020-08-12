
var mongoose = require("mongoose");
var recipeSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
       {
           type: mongoose.Schema.Types.ObjectId,
           ref: "comment"
       }
    ]
});

//compiling schema into model
module.exports  = mongoose.model("recipe", recipeSchema);
