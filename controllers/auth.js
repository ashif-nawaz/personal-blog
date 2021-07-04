const path = require('path');
const crypto = require('crypto');

const mongodb = require('mongodb');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


const ObjectId = mongodb.ObjectId;

const User = require('../models/user');
const mailTransport = require('../util/mail-transport');


exports.postSignup = (req, res, next) => {
    const vError = validationResult(req);
    if(!vError.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 400;
        error.data = vError.array();
        throw error;
    }

    const { name, gender, phone, email, password, dob } = req.body;
    bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
        const user = new User(name, gender, phone, email, hashedPassword, dob);
        return user.save(); 
    })
    .then((insertionResult) => {
        res.json({
            status : 201,
            data : {
                userId : insertionResult.insertedId
            },
            info : 'Success'
        })
        mailTransport.sendMail({
            from : 'sshmshf@gmail.com',
            to : email,
            subject : 'Welcome on board to the world of opportunity',
            html : `
                    <h1 style="color : red;">Welcome to our platform<h1>
                   `,
        })
    })
    .catch((error) => {
        next(error);
    })

}


exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;
    let loadedUser;
    User
    .findByEmail(email)
    .then((user) => {
       if(!user) {
        const error = new Error('No such user exists.');
        error.statusCode = 404;
        throw error;
       }

       loadedUser = user;
       return bcrypt.compare(password, user.password);
    })
    .then((isMatched) => {
        if(!isMatched) {
            const error = new Error('Incorrect password.');
            error.statusCode = 401;
            throw error;
        }
        
        const token = jwt.sign({
                        name : loadedUser.name,
                        email : loadedUser.email, 
                        userId : loadedUser._id.toString()
                      },
                      'secret key for signing the login token',
                      {expiresIn : '7d'});
        res
        .status(200)
        .json({
            status : 200,
            data : {
                tokenCreated : true,
                token : token
            },
            info : 'Success'
        })
    })
    .catch((error) => {
        next(error);
    })
}


exports.postResetEmail = (req, res, next) => {
    const { email }  = req.body;
    const vError = validationResult(req);
    if(!vError.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 400;
        error.data = vError.array();
        throw error;
    }
    
    let otp;
    User
    .findByEmail(email)
    .then((user) => {
        if(!user) {
            const error = new Error('No such user exist, Please signup!');
            error.statusCode = 404;
            error.data = {
                requestEmail : email
            }
            throw error;
        }
       
        otp = Math.floor(100000 + Math.random() * 900000);
        return User.updateOne(
                {_id : new ObjectId(user._id.toString()), email : email},
                {$set :{otp : otp, otpExpiresIn : Date.now() + (10 * 60 * 1000)}}
            )
    })
    .then((updateResult) => {
        // if otp not updated in database
       return mailTransport
              .sendMail({
                    to : email,
                    from : 'sshmshf@gmail.com',
                    subject : 'OTP for Blogger Password Reset',
                    html : `<p style="color: black; weight : 400; text-align: center;">Please find OTP for password reset.</p>
                            <h1 style="color: gray; weight : 800; text-align: center;">${otp}</h1>
                        `
              })
    })
    .then((mailSent) => {
        // if mail not sent successfully
        console.log(mailSent);
        res
        .status(200)
        .json({
            status : 200,
            data : {
                message : 'Mail sent with OTP for password reset',
                email : email
            },
            info : 'Success'
        })

    })
    .catch((error) => {
        next(error);
    })
}


exports.postNewPassword = (req, res, next) => {
     const { otp, password, confirmPassword, email } = req.body;
     const vError = validationResult(req);
     if(!vError.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 400;
        error.data = vError.array();
        throw error;
     }

     let loadedUser;
     User
     .findOne({
          otp : otp,
          email : email,
          otpExpiresIn : {$gt : Date.now()}
     })
     .then((user) => {
         console.log(user);
         if(!user) {
             const error = new Error('OTP expired, Please try again');
             error.statusCode = 403;
             error.data = {
                 message : 'OTP expired'
             }
             throw error;
         }
         loadedUser = user;
         return bcrypt.hash(password, 12);
     })
     .then((hashedPassword) => {
         return User.updateOne(
             {  _id : new ObjectId(loadedUser._id.toString()) },
             {
                $set : {password : hashedPassword},
                $unset : {otp : null, otpExpiresIn : null}
             }
            )
     })
     .then((updateResult) => {
         res
         .status(200)
         .json({
             status : 200,
             data : {
                 message : 'Password Resetted successfully.'
             },
             info : 'Success'
         })
     })
     .catch((error) => {
         next(error);
     })
}