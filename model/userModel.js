const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        names: {
            type: String,
            required: true,
        },
        surnames: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    }
);




const User = mongoose.model('User', userSchema);



const createUser = async (names,surnames, email, hashedPassword) => {
    const newUser = new User({
        names,
        surnames,
        email,
        password: hashedPassword,
    });
    try {
        await newUser.save();
        return newUser;
        } catch (error) {
           throw new Error('Error saving user: ' + error.message);
        }
}
module.exports = {
    createUser,
    User,
};