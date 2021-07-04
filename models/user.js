const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

const dbClient = require('../util/database').getDB;


class User {
    constructor(name, gender, phone, email, password, dob = '1996-11-05') {
        this.name = name;
        this.gender = gender;
        this.phone = phone;
        this.email = email;
        this.password = password;
        this.dob = new Date(dob).toISOString();
    }


    save() {
        return dbClient()
               .db()
               .collection('users')
               .insertOne(this);
    }

    static findOne(query = {}) {
        return dbClient()
               .db()
               .collection('users')
               .findOne(query);
    }

    static findById(id) {
        return dbClient()
               .db()
               .collection('users')
               .findOne({_id : new ObjectId(id.toString())});
    }

    static findByPhone(phone) {
        return dbClient()
               .db()
               .collection('users')
               .findOne({phone : phone});
    }

    static findByEmail(email) {
        return dbClient()
               .db()
               .collection('users')
               .findOne({email : email});
    }

    static updateOne(query ={}, update = {}) {
        return dbClient()
               .db()
               .collection('users')
               .updateOne(query, update);
    }
}


module.exports = User;