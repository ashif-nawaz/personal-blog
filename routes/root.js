const express = require('express');
const router = express.Router();

const root_contr = require('../controllers/root');



router.get('/', root_contr.getHome);


module.exports = router;