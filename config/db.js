const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env file

// MongoDB connection URI from .env file
const MONGO_URI = process.env.MONGO_URI;

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        // Connect to MongoDB using Mongoose
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1); // Exit the process with failure
    }
};

// Export the connection function
module.exports = connectDB;
