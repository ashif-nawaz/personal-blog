const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;


let _db;

const initDB = () => {
    return new Promise((resolve, reject) => {
        const mClinet = new MongoClient('mongodb://localhost:27017/blogger', {useUnifiedTopology : true});
        mClinet
        .connect()
        .then((client) => {
            _db = client;
            resolve(client);
        })
        .catch((error) => {
            reject(error);
        })
    })
     
}


const getDB = () =>{
     if(!_db) {
         throw new Error('Cound\'t connect to the database.');
     }

     return _db;
}


module.exports = {
    initDB,
    getDB
}