const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const User = require('../models/user');
const contr_auth = require('../controllers/auth');


router.post('/signup',
[
    body('name')
    .isString()
    .isAlpha('en-IN')
    .withMessage('Please enter a valid name'),

    body('gender')
    .isAlpha('en-IN')
    .withMessage('Please enter a valid gender'),

    body('phone')
    .isMobilePhone('en-IN')
    .withMessage('Please enter a valid phone number')
    .custom((value , { req }) => {
        return User
                .findByPhone(value)
                .then((user) => {
                    if(user) {
                        return Promise.reject('Phone already exist, Please try logging in');
                    }
                })
                    
    }),

    body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value , { req }) => {
        return User
            .findByEmail(value)
            .then((user) => {
                if(user) {
                    return Promise.reject('Email already exist, Please try logging in');
                }
            })
                
    }),

    body('password')
    .isStrongPassword({minLength : 8, minUppercase : 1, minNumbers : 1})
    .withMessage('Please enter a valid password')
    .custom((value, { req }) => {
        return value === req.body.confirmPassword;
    })
    .withMessage('Password doesn\'t match')

],
 contr_auth.postSignup);

router.post('/login', contr_auth.postLogin);

router.post('/reset-password', 
body('email')
.isEmail()
.withMessage('Please enter a valid email.'),
contr_auth.postResetEmail);

router.post('/verifyotp',
[
    body('otp')
    .isNumeric({locale : 'en-IN'})
    .isLength({max : 6, min : 6})
    .withMessage('Invalid OTP'),

    body('password')
    .isStrongPassword({minLength : 8, minUppercase : 1, minNumbers : 1})
    .withMessage('Please enter a valid password')
    .custom((value, { req }) => {
        return value === req.body.confirmPassword;
    })
    .withMessage('Password doesn\'t match')
],

contr_auth.postNewPassword)



module.exports = router;