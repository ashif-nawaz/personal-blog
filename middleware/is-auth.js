const jwt = require('jsonwebtoken');

const User = require('../models/user');

module.exports = (req, res, next) => {
     let token = req.get('Authorization');
     if(!token) {
        const error = new Error('Not Authenticated');
        error.statusCode = 401;
        throw error;
     }

     token = token.split(' ')[1].trim();

     let decodedToken;
     try {
        decodedToken = jwt.verify(token, 'secret key for signing the login token');
     } catch (error) {
        error.message = 'Error occured while decoding authorization token.';
        throw error;
     }
     
     if(!decodedToken) {
        const error = new Error('Authentication failed');
        error.statusCode = 401;
        throw error;
     }

     User
     .findById(decodedToken.userId)
     .then((user) => {
        if(!user) {
            const error = new Error('No such user found!');
            error.statusCode = 404;
            throw error;
        }
        req.user = user;
        next(); 
     })
     .catch((error) => {
         next(error);
     }); 
}