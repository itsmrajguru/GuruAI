require('dotenv').config();
const jwt = require('jsonwebtoken');
const joi = require('joi');
const userModel = require('../models/user.model.js');
const otpModel = require('../models/otp.model.js');
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
    email: joi.string().email().required(),
    password: joi.string().min(4).required()
});

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(4).required()
});

// Signup Controller 
const signup = async (req, res) => {
    // step 1: Take credentials from frontend
    const { email, password } = req.body

    // step 2: Validate the credentials with the joi
    const { error } = signupSchema.validate({ email, password })
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        })
    }
    else {
        //If the user Credentials are okay,then proceed to further steps
        try {
            // step 1:check whether the email already exists
            const isUserAlreadyExists = await userModel.findOne({ email })
            if (isUserAlreadyExists) {
                return res.status(400).json({
                    success: false,
                    message: 'email already exists'
                })
            }

            /* step 2 :If the user is not already registered , then
            hash the password ,
            but it is already being done in the userModel*/

            // step 3: now choose one of the emial or otp verification 
            /* STEPS FOR EMAIL VERIFICATION:
                Step 1 : Create a new user with isVerified: false
                Step 2 : Generate a random token
                Step 2 : save random token in database as VerificationToken
                Step 3 : generate a Verify URL which will contain frontendURL + verificationToken
                Step 4 : pass this verifyURL to message and message in the email HTML
                Step 6 : send emailVerification email to user via Resend
                Step 7 : accept the token through the frontend
                Step 8 : and verify the token through VerifyEmail REST API */

            /* STEPS FOR OTP EMAIL VERIFICATION:
                Step 1 : Create a new user with isVerified: false
                Step 2 : Generate a random 6-digit OTP
                Step 3 : Delete any old OTPs for this email and save the new one
                Step 4 : Build OTP email HTML
                Step 5 : Send OTP email to user via Resend
                Step 6 : Return requiresOtp: true so frontend shows the OTP input
                Step 7 : User enters OTP on frontend → calls /verify-signup-otp
                Step 8 : On OTP match, mark isVerified: true and create blank profile */

            // step 1: actually insert the unverified user into the database
            await userModel.create({ email, password, isVerified: false });

            // step 2:generate a six digit random otp
            await otpModel.deleteMany({ email });
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            await otpModel.create({ email, otp: otpCode });

            //step 2: creating email HTML
            const html = `
                <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f0fbfe;border-radius:16px;">
                    <h2 style="color:#0179a0;margin-bottom:8px;">Verify Your GuruAI Account</h2>
                    <p style="color:#444;font-size:15px;">Use the OTP below to complete your registration. It expires in <strong>10 minutes</strong>.</p>
                    <div style="font-size:40px;font-weight:900;letter-spacing:10px;color:#111;background:#fff;border:2px solid #b3eefb;border-radius:12px;padding:20px 28px;display:inline-block;margin:20px 0;">${otpCode}</div>
                    <p style="color:#888;font-size:12px;">If you did not create a GuruAI account, you can safely ignore this email.</p>
                </div>
            `;


            // Step 3 : Send OTP email via Resend
            setTimeout(async () => {
                try {
                    const emailSent = await sendEmail({
                        to: email,
                        subject: 'GuruAI — Verify Your Account',
                        text: `Your GuruAI verification OTP is: ${otpCode}. It expires in 10 minutes.`,
                        html
                    })

                    if (!emailSent) {
                        console.log(`Verification OTP Email send failed...`);
                    }
                    console.log("Email Sent Successfully")
                } catch (e) {
                    console.log('Email Send Error :', e);
                }
            }, 0);

            return res.status(201).json({
                success: true,
                message: 'OTP sent to your email. Please verify to complete registration.',
                requiresOtp: true,
                email
            });
        } catch (e) {
            console.log(e)
            res.status(500).json({
                success: false,
                message: 'Something went wrong ! Please try again'
            })
        }
    }
}





// Login Controller 
const login = async (req, res) => {
    //extract user credentials from req.body
    const { email, password } = req.body;

    //validate the credenetials with joi.object
    const { error } = loginSchema.validate({ email, password })

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    else {
        try {
            // step 1: verify whether the emailId is registered or not
            const getUser = await userModel.findOne({ email })
            if (!getUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Incorrect Email'
                });
            }

            // step 2: brcypt the password
            const isPasswordCorrect = await getUser.matchPassword(password)

            if (!isPasswordCorrect) {
                return res.status(400).json({
                    success: false,
                    message: 'Incorrect Password'
                });
            }

            //step 3:Check is the user Vetified 
            /*when the user will verify the email
            we are changing isVEerified===true and here
            if the user is not verified,the this function will run*/

            if (!getUser.isVerified) {
                return res.status(200).json({
                    success: false,
                    message: 'Please verify your email before logging in'
                });
            }
            //step 4:Generate Access & Refresh Tokens
            const accessToken = generateAccessToken(getUser?._id)
            const refreshToken = generateRefreshToken(getUser?._id)

            //step 5: putting the tokens in the Cookie-Parser
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true, //js can not access it
                secure: false,   // set true in production as (HTTPS)
                sameSite: 'Lax',    // CSRF protection 
                maxAge: 24 * 60 * 60 * 1000
            })

            return res.status(200).json({
                success: true,
                message: 'Login Successful',
                accessToken,
                /*only access token is sent in response because
                it is storedd in the localStorage and sent to authMiddleware 
                for verification of user by every 15 min  */
                user: {
                    _id: getUser._id,
                    email: getUser.email
                }
            });

        } catch (e) {
            console.log(e)
            res.status(500).json({
                success: false,
                message: 'Something went wrong ! Please try again'
            })
        }
    }
}



// Verify Signup OTP Controller — validates OTP and marks user as verified
const verifySignupOtp = async (req, res) => {
    //extract email and otp from req.body
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    try {
        //step 1 : look up the OTP record for this email
        const record = await otpModel.findOne({ email });

        if (!record) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired or not found. Please sign up again.'
            });
        }

        //step 2 : compare the entered OTP with the saved one
        if (record.otp !== otp.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect OTP. Please try again.'
            });
        }

        // OTP is valid — delete it so it cannot be reused
        await otpModel.deleteMany({ email });

        //step 3 : mark the user as verified in the database
        const user = await userModel.findOneAndUpdate({ email }, { isVerified: true }, { new: true });

        return res.status(200).json({
            success: true,
            message: 'Email verified successfully. You can now log in.'
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
    }
}


// Forgot Password Controller
const forgotPassword = async (req, res) => {
    //extract the email from req.body
    const { email } = req.body

    //define emailSchema using joi
    const emailSchema = joi.object({
        email: joi.string().email().required()
    })

    //validate the emailSchema
    const { error } = emailSchema.validate({ email })

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    else {
        try {
            //step 1 :Validate the email,whether registered or not ?
            const getUser = await userModel.findOne({ email, })

            // Even If , user is not registerd ,stilll show 200
            if (!getUser) {
                return res.status(200).json({
                    success: true,
                    message: 'If this email is registered, a reset link has been sent.'
                });
            }

            //Step 1:generate a reset Token
            const resetToken = crypto.randomBytes(32).toString('hex')

            //EXTRA :hash reset Token
            const hashedResetToken = crypto
                .createHash('sha256')
                .update(resetToken)
                .digest('hex')
            //update DB with resetToken
            getUser.resetPasswordToken = hashedResetToken;
            getUser.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
            await getUser.save()

            //step 3:Inject the reset Token in the resetURL
            const resetURL = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`

            //Step 4 :generate a message
            const msg = `You requested a password reset.\n\nReset your password here (valid 15 mins):\n\n${resetURL}\n\nIgnore this email if you didn't request it.`

            //step 5 :Send Email
            setTimeout(async () => {
                try {
                    const emailSent = await sendEmail({
                        to: getUser.email,
                        subject: 'GuruAI - Password Reset Request',
                        text: msg
                    })
                    if (!emailSent) {
                        console.log('Email Reset Link send failed')
                    }
                } catch (e) {
                    console.log('Reset Email Send Error:', e);
                }
            }, 0);
            return res.status(200).json({
                success: true,
                message: 'If this email is registered, a reset link has been sent.'
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                success: false,
                message: 'Something went wrong! Please try again'
            });
        }
    }
}

// Reset Password Controller

const resetPassword = async (req, res) => {
    /*extract newPassword as well as the token extracted by
    frontend from email*/
    const { token, newPassword } = req.body

    //generate a newPassword Validation Schema
    const newPasswordSchema = joi.object({
        newPassword: joi.string().min(4).required()
    })

    //validate the newPassword
    const { error } = newPasswordSchema.validate({ newPassword })

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    else {
        try {
            //validate token
            const getUser = await userModel.findOne({
                resetPasswordToken: token,
                resetPasswordExpire: { $gt: Date.now() }
            })

            if (!getUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid or expired reset token. Please try again !'
                });
            }

            //otherwise update DB with new Password
            getUser.password = newPassword
            getUser.resetPasswordToken = undefined
            getUser.resetPasswordExpire = undefined

            await getUser.save()
            return res.status(200).json({
                success: true,
                message: 'Password reset successfully. Please login.'
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                success: false,
                message: 'Something went wrong! Please try again'
            });
        }
    }
}

// POST /api/auth/token/refresh
const refreshToken = async (req, res) => {
    //extract the refresh Token from cookies
    /* refreshToken is automatically send by axios due to
    withCredentials : true*/
    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No refresh token found. Please login again.'
        });
    }
    try {
        /* Step 1: Verify the token, Decode it and it will return
            the original _id giveb by MongoDB,as we created token with
            the help of that id */
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)

        //step2 :Generate new acess token
        const newAccessToken = generateAccessToken(decoded?.id)

        return res.status(201).json({
            success: true,
            message: 'NewAcessToken generated Successfully',
            newAccessToken /*this will be stored in the originalRequest.headers.[authorization]
          as a bearer token */
        });

    } catch (e) {
        return res.status(401).json({
            success: false,
            message: 'Refresh token invalid or expired. Please login again.'
        });
    }
}

module.exports = {
    signup,
    login,
    verifySignupOtp,
    resetPassword,
    forgotPassword,
    refreshToken
}
