const express=require('express')
const authRouter=express.Router()

//importing controller
const authController = require('../controllers/auth.controller');

// User Authentication Routes
authRouter.post('/signup/', authController.signup);
authRouter.post('/login/', authController.login);
authRouter.post('/verify-signup-otp/', authController.verifySignupOtp); //verifies OTP sent during signup to complete registration
authRouter.post('/forgot-password/', authController.forgotPassword);
authRouter.post('/reset-password/', authController.resetPassword);
authRouter.post('/token/refresh/', authController.refreshToken);
module.exports={authRouter}