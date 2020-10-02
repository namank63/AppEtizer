/*********************************************************
TEMP DATA TO SEED
**********************************************************/
var mongoose = require("mongoose");
var Recipe   = require("./models/recipe");
var Comment = require("./models/comment");

var data =[
    {
        name: "Naan",
        image: " https://th.bing.com/th/id/OIP.kkjymEgg3sCcUx7Hw0LHggHaHa?pid=Api&rs=1",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Paneer pakora",
        image: "https://th.bing.com/th/id/OIP.tRDbY_9MGZAKIl_jHTERbgAAAA?w=246&h=184&c=7&o=5&dpr=1.5&pid=1.7",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Gulab jamun",
        image: " https://th.bing.com/th/id/OIP.k_You121ypRkETTZaIn2uQHaE8?w=267&h=180&c=7&o=5&dpr=1.5&pid=1.7",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }
]

function seedDB(){
    // remove all recipies
    Recipe.deleteMany({}, function(err){
        if(err) {
            console.log(err);
        } else {
            console.log("Removed recipes!!");
        }
        Comment.deleteMany({}, function(err){
            if(err) {
                console.log("err");
            } else {
                console.log("Removed comments!!");
            }
        });
        //add a few recipes
        data.forEach(function(seed) {
          Recipe.create(seed, function(err, recipe) {
            if(err) {
                console.log(err);
            } else {
                console.log("added a new recipe");
                //create a comment
                Comment.create(
                    {
                        text: " Recipe is  easy and dishes are too delicius ",
                        author: "Homer"
                    }, function(err, comment) {
                        if (err) {
                            console.log(err);
                        } else {
                            recipe.comments.push(comment);
                            recipe.save();
                            console.log("created new comment");
                        }
                    });
                }
           });
       });
    });
    // add few comments
}

module.exports = seedDB;