const express =require("express");
const router=express.Router();
const authController=require("../controller/authController");




// Route for user login
// Route for user registration
router.get("/",(req,res)=>{
    res.render("auth/login");
})
router.get("/register",(req,res)=>{
    res.render("auth/register");
})
router.post("/", authController.loginUser);
router.post("/register", authController.registerUser);


router.get("/otp",(req,res)=>{
    res.render("auth/otpConfirm");
})
router.post("/otp",authController.UserOTP);


router.get('/logout',(req,res)=>{
    if(req.session){
        req.session.destroy((err)=>{
            if (err) {
                console.error('Error destroying session:', err);
            }
        })
    }
    console.log("logout sucessfully");
    res.redirect('/');
});


router.get("/resetpassword",(req,res)=>{
    res.render('auth/forgot');
});
router.post('/resetpassword',authController.ResetPassword);

module.exports = router;


