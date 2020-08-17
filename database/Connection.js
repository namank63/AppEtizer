/*********************************************************
ONLINE MONGODB CONFIGURATION
**********************************************************/
const mongoose = require("mongoose");

const connectDB = async() => {
    await mongoose.connect("mongodb+srv://namanurvashi:Nk63@Us02@appetizer.i4yic.mongodb.net/recipes?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true });
    console.log("Online DataBase is connected!!");
}

module.exports = connectDB;