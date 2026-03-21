const express=require('express')
const authRouter=express.Router()

//importing controller
const authController = require('../controllers/auth.controller');

// User Authentication Routes
authRouter.post('/signup/', authController.signup);
authRouter.post('/login/', authController.login);
module.exports={authRouter}
