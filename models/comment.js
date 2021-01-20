/*********************************************************
COMMENT SCHEMA
**********************************************************/
var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        commentTime: Date
    }
});

module.exports = mongoose.model("Comment", commentSchema);