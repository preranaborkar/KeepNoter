const bcrypt = require('bcryptjs');
const userModel = require('../model/userModel');
const { name } = require('ejs');

const validator = require('validator');
const nodemailer = require("nodemailer");
const crypto = require('crypto');  // To generate OTP

const tempData={};
// Register a user
const registerUser =  async (req, res) => {
  const { names,surnames, email, password} = req.body;
  console.log("email :",email);
  console.log("password :",password);
  console.log("names :",names);
  console.log("surname :",surnames)
  console.log("register me enter kiya");
 
  try {

    const existingUser = await userModel.User.findOne({ email: email });
console.log("existeuser line");
    if (existingUser) {
      return res.render('auth/register', { error: 'User already exists with this email.' });
      
    }
    if (!validateEmail(email)) {
        return res.render('auth/register',{error:'Email does not exist'});
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    tempData.names=names;
    tempData.surnames=surnames;
    tempData.email=email;
    tempData.hashedPassword=hashedPassword;
    
console.log("new user ",tempData);
    // if (newUser) { // Check if a user object is returned
    //   return res.redirect('/'); // Corrected the route for the login page
    // }

    const otpgenerated = generateOtp();
    const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes expiration time
   

    // Send OTP to the user's email
    await sendOtpEmail(tempData.email, otpgenerated);
    tempData.otpgenerated=otpgenerated;
    console.log("temeperlly user ",tempData);

    return res.render('auth/otpConfirm', tempData);


} catch (err) {
  return res.render('auth/register', { error: 'Unexpected error' });
};
}
// User login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
 console.log("email :",email);
 console.log("password :",password);
  console.log("login me enter kiya");
 
  // console.log('Login request:', req.body);
  if (!email || !password) {
    return res.render('auth/login', { error: 'Email and password are required.' });
  }


  try {
    const user = await userModel.User.findOne({email:email});
console.log(user);
   
    if (!user) {
      return res.render('auth/login', { error: 'No user found with this email.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('auth/login', { error: 'Invalid Password' });
    }
    console.log("hii");

    req.session.user = { userId: user._id, names: user.names ,surnames: user.surnames, email: user.email };
    // res.send('Login successful');
    res.redirect(`/dashboard`);
  } catch (err) {
    return res.render('auth/login', { error: 'Error logging in: ' + err.message });
  }
  
};

 const UserOTP= async (req,res)=>{
   
    
    const {otp} = req.body;
     console.log(otp);
     console.log("otp user",tempData);
    if (Date.now() > tempData.expirationTime) {
        console.log("OTP expired at:", expirationTime);

        return res.render('auth/register', { error: 'OTP Expired'});
    }

    if (otp === tempData.otpgenerated) {
        console.log("OTP verified successfully.");
        const newuser = await userModel.createUser(tempData.names,tempData.surnames, tempData.email, tempData.hashedPassword);
        res.render('auth/login');
    } else {
        return res.render('auth/otpConfirm', { error: 'Invalid OTP'});
    }

    
   
}
// Function to validate email format
const validateEmail = (email) => {
    return validator.isEmail(email);  // Checks for valid email
};

// Function to generate a 6-digit OTP
const generateOtp = () => {
    return crypto.randomInt(100000, 999999).toString(); // Generate OTP between 100000 and 999999
};

// Function to send OTP email
const sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, // Use the email from environment variables
            pass: process.env.EMAIL_PASSWORD // Use the password from environment variables
        }
    });
    
    const info = await transporter.sendMail({
        from: `"KeepNoter 👻" <${process.env.EMAIL}>`, 
        to: email, 
        subject: "OTP for Registration", 
        text: `Your OTP is ${otp}. This OTP is valid for 5 minutes.`, // Plain text body
        html: `<b>Your OTP is ${otp}</b><br><p>This OTP is valid for 5 minutes.</p>`, // HTML body
    });

    console.log("Message sent: %s", info.messageId);
};
           
const ResetPassword=async(req,res)=>{
          const {email,new_password,confirm_password}=req.body;
          const user=await userModel.User.findOne({email:email});
          if(!user){
            return res.render('auth/forgot',{error:'Email not registered'});
          }
          if(new_password!=confirm_password){
            return res.render('auth/forgot',{error:'Password mismated'});
          }
          const hashedPassword = await bcrypt.hash(new_password, 10);
          user.password=hashedPassword;
          user.save();
          console.log("password change succesfully");
        res.redirect('/');
}

module.exports = {
  registerUser,
  loginUser,
  UserOTP,
  ResetPassword,
};
