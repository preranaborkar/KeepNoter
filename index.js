const express=require("express");
const app=express();
const path=require("path");
const connectDB = require("./config/db"); // Import the DB connection function
require("dotenv").config(); // Load environment variables
const authRoute = require("./route/authRoute.js");
const dashboardRoute=require('./route/dashboardRoute.js')
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));




app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
  }));

const PORT = process.env.PORT || 8080;
connectDB();


// Routes
app.use("/", authRoute);
app.use('/',dashboardRoute);

app.use(express.json());





app.listen(PORT,()=>{
   
    console.log(`server is running on port ${PORT}`);
    
})