const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : 'sshmshf@gmail.com',
        pass : 'LOVEYOU@ISHU2'
    }
});

