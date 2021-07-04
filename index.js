const path = require('path');

const express = require('express');

const root_routes = require('./routes/root');
const post_routes = require('./routes/post');
const auth_routes = require('./routes/auth');
const dbConnection = require('./util/database');
const erro_contr = require('./controllers/errors');


const app = express();


app.use(express.static(path.join(__dirname, '/public')));

app.use(express.json());

app.use((req, res, next) => {
     res.removeHeader('X-Powered-By');
     res.setHeader('Access-Control-Allow-Origin', '*')
     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
     next();
})


app.use('/api/v1', root_routes);
app.use('/api/v1/posts', post_routes);
app.use('/api/v1/auth', auth_routes);


app.use(erro_contr.get404);
app.use(erro_contr.getErrors);


dbConnection
.initDB()
.then((dbClient) => {
    app.listen(8080, () => {
      console.log('The server is running at http://localhost:8080/');
    })
})
.catch((error) => {
    console.log(error);
})
