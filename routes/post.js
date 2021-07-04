const express = require('express');
const router = express.Router();

const post_contr = require('../controllers/post');
const isValidMongoId = require('../middleware/is-validMongoID');
const isAuth = require('../middleware/is-auth');




router.get('/', isAuth, post_contr.getAllPosts);
router.post('/', isAuth, post_contr.createPost);
router.get('/:postId', isAuth, isValidMongoId('postId', 'Invalid Post ID.'), post_contr.getPostById);
router.patch('/:postId', isAuth, isValidMongoId('postId', 'Invalid Post ID.'), post_contr.updatePost);
router.delete('/:postId', isAuth, isValidMongoId('postId', 'Invalid Post ID.'), post_contr.deletePost);



module.exports = router;