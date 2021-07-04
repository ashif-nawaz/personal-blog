const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;


const dbClient = require('../util/database').getDB;

class Post {
    constructor(title, content, author, userId) {
         this.title = title;
         this.content = content;
         this.author = author;
         this.userId = ObjectId(userId.toString());
         this.createdAt = new Date().toISOString();
    }

    save() {
        return dbClient()
               .db()
               .collection('posts')
               .insertOne(this);
    }


    static findById(id) {
        return dbClient()
               .db()
               .collection('posts')
               .findOne({_id : new ObjectId(id.toString())});
    }

    static findOne(query = {}) {
        return dbClient()
               .db()
               .collection('posts')
               .findOne(query);
    }

    static findByUserId(userid) {
        return dbClient()
               .db()
               .collection('posts')
               .find({userId : new ObjectId(userid.toString())})
               .toArray();
    }

    static findAllPost() {
        return dbClient()
               .db()
               .collection('posts')
               .find()
               .toArray();
    }

    static updateById(id, newPost = {}) {
        return dbClient()
               .db()
               .collection('posts')
               .updateOne({_id : new ObjectId(id)}, {$set : newPost});
    }

    static deleteById(id) {
        return dbClient()
               .db()
               .collection('posts')
               .deleteOne({_id : new ObjectId(id)});
    }
}


module.exports = Post;