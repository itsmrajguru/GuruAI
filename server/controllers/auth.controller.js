require('dotenv').config();
const jwt = require('jsonwebtoken');
const joi = require('joi');
const userModel = require('../models/user.model.js');
const crypto = require('crypto');
const { sendEmail } = require('../services/email.service.js');

//creating Token Generators 
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' });
};


// user Credentials are validated using these properties
const signupSchema = joi.object({
    username: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(4).required()
});

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(4).required()
});

// Signup Controller 

const signup = async (req, res) => {

    // Firstly extract credentials from frontend
    const { username, email, password } = req.body;

    // then lets validate the user credentials
    const { error } = signupSchema.validate({ username, email, password });

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
            /* this error is an array which contains all error properties */
        });
    }
    else {
        try {
            /* now we will check whether the emailId or email
             already exists or not ?*/

            const isUserAlreadyExists = await userModel.findOne({
                $or: [
                    { email }, { username }
                ]
            })

            if (isUserAlreadyExists) {
                const msg = isUserAlreadyExists.email === email
                    ? "Email is already registered"
                    : "Username  is already taken"

                return res.status(400).json({
                    success: false,
                    message: msg
                });
            }

            // Next is hashing the password (already done in userModel via pre('save'))

            /* STEPS FOR EMAIL VERIFICATION:
                Step 1 : when user registers with email-id, generate random token
                Step 2 : save random token in database as VerificationToken
                Step 3 : generate a Verify URL which will contain frontendURL + verificationToken
                Step 4 : pass this verifyURL to message
                Step 5 : pass the message to emailservice provider
                Step 6 : sen email to user
                Step 7 : accept the token through the frontend
                Step 8 : and verify the token through VerifyEmail REST API
            */

            // step 1: generate verification token
            const verificationToken = crypto.randomBytes(32).toString('hex');

            //EXTRA :Hash Token
            const hashedVerificationToken = crypto
                .createHash('sha256')
                .update(verificationToken)
                .digest('hex')

            /* step2 :create a new user with updated VerificationToken and save in
            the database*/
            const getUser = await userModel.create({
                username,
                email,
                password,
                verificationToken: hashedVerificationToken,
                isVerified: true // changed to true for local server run, otherwise remove this line and comma (,)
            });

            // this Creates a blank profile for the getUser
            await profileModel.create({ user: getUser._id });

            // Step 3: Build email verification URL
            const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify?token=${verificationToken}`;

            // Step 4: pass the VerifyUrl in the message
            const message = `Welcome to GuruAI !\n\nPlease verify your email by clicking on the following link:\n\n${verifyUrl}`;

            // Step 5: Send verification email
            setTimeout(async () => {
                try {
                    const emailSent = await sendEmail({
                        to: getUser.email,
                        subject: 'GuruAI - Email Verification',
                        text: message
                    })

                    if (!emailSent) {
                        console.log(`Vericaltion Email send failed...`);
                    }
                    console.log("Email Sent Successfully")
                } catch (e) {
                    console.log('Email Send Error :', e);
                }
            }, 0);

            return res.status(201).json({
                success: true,
                message: 'Account created successfully. Please verify your email.'
            });
        } catch (e) {
            console.log(e)
            res.status(500).json({
                success: false,
                message: 'Something went wrong ! Please try again'
            })
        }
    }
}; // Fixed: Added missing closing brace for signup function


module.exports = {
    signup

}