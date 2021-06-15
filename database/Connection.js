/*********************************************************
ONLINE MONGODB CONFIGURATION
**********************************************************/
const mongoose = require("mongoose");
require('dotenv').config();

const connectDB = async() => {
    await mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true });
    console.log("DataBase Connected!!");
}

module.exports = connectDB;