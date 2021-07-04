const ObjectId = require('mongodb').ObjectId;

const Post = require('../models/post');




exports.getAllPosts = (req, res, next) => {
    Post
    .findAllPost()
    .then((posts) => {
        res
        .status(200)
        .json({
            status : 200,
            data : posts,
            info : 'Success'
        });
    })
    .catch((error) => {
        next(error);
    })
   
}


exports.getPostById = (req, res, next) => {
    const { postId } = req.params;
    Post
    .findById(postId)
    .then((post) => {
        if(!post) {
            const error = new Error('No such post found!');
            error.statusCode = 404;
            throw error;
        }

        res
        .status(200)
        .json({
            status : 200,
            data : post,
            info : 'Success'
        });
    })
    .catch((error) => {
        next(error);
    })
   
}


exports.getPostsByUserId = (req, res, next) => {
    const { userId } = req.params;
    Post
    .findByUserId(userId)
    .then((posts) => {
        res
        .status(200)
        .json({
            status : 200,
            data : posts,
            info : 'Success'
        });
    })
    .catch((error) => {
        next(error);
    })
   
}


exports.createPost = (req, res, next) => {
    const { title, content } = req.body;
    const post = new Post(title, content, req.user.name, req.user._id);
    post
    .save()
    .then((insertionResult) => {
        res
        .status(201)
        .json({
             status : 201, 
             data : {
                 createdPostId : insertionResult.insertedId
             },
             info : 'Success'
        });   
    })
    .catch((error) => {
        next(error);
    })
}


exports.updatePost = (req, res, next) => {
    const { postId } = req.params;
    const newPost = req.body;
    Post
    .findById(postId)
    .then((post) => {
        if(!post) {
            const error = new Error('No such post found!');
            error.statusCode = 404;
            throw error;
        }
        
        if(post.userId.toString() !== req.user._id.toString()){
            const error = new Error('Not authorized to update post');
            error.statusCode = 403;
            throw error;
        }

        return Post.updateById(postId, newPost);
    })
    .then((updateResult) => {
        res
        .status(201)
        .json({
            status : 201,
            data : {
                updatedPostId : postId
            },
            info : 'Success'
        })
    })
    .catch((error) => {
        next(error);
    })

}


exports.deletePost = (req, res, next) => {
    const { postId } = req.params;
    Post
    .findById(postId)
    .then((post) => {
        if(!post) {
            const error = new Error('No such post found!');
            error.statusCode = 404;
            throw error;
        }

        if(post.userId.toString() !== req.user._id.toString()){
            const error = new Error('Not authorized for this action');
            error.statusCode = 403;
            throw error;
        }

        return Post.deleteById(postId);
    })
    .then((deletionResult) => {
        res
        .status(204)
        .json({
            status : 204,
            data : {
                postDeleted : true
            },
            info : 'Success'
        })
        
    })
    .catch((error) => {
        next(error);
    })

}
