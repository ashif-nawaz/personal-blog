const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

module.exports = (paramName = '', message = 'Invalid ID') => {
     return (req, res, next) => {
        const id = req.params[paramName];
        if(!ObjectId.isValid(id)) {
            const error = new Error(message);
            error.statusCode = 400;
            throw error;
        }
        next();
     }
}