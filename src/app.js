const path = require('path');
const express = require('express');
const assert = require('assert');

/*
* Currently Using MongoDB, but everything is treated as object and can't precisely share same fields between them
* hence object db doesn't allow cascading on update. So SQL database might better off here.
* Transfer db from mongodb to sql such as mysql & sequelize in the future version.
 */
const MongoClient = require('mongodb').MongoClient;
// const DB_URL = 'mongodb+srv://<user>:<passwd>@cluster0.hpqe3.gcp.mongodb.net/website?retryWrites=true&w=majority';
const DB_URL = 'localhost:27017' //on premise database.
const DB_client = new MongoClient(DB_URL);

const {getAllQuestionInfo, getQuestionInfo, postQuestionInfo, putQuestionInfo,
    getQuestion, putQuestion, deleteQuestion, postRunCode} = require("./api/api_coding.js");

const {getAllClasses, getClass, postClass, putClass, deleteClass,
    getDoc, postDoc, putDoc, deleteDoc} = require('./api/api_class.js');


const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', ['GET', 'POST', 'DELETE', 'PUT']);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// API INTERFACE
app.all('/api', (req, res) => {
    res.sendFile(path.join(__dirname, 'api/api_doc.html'));
});

// CODING INTERFACE
app.get('/api/coding/questions/info', (req, res) => {
    DB_client.connect(function(err) {
        assert.strictEqual(null, err);
        let db = DB_client.db('website');

        getAllQuestionInfo(req, res, db);
    })
})

app.post('/api/coding/questions/info', (req, res) => {
   DB_client.connect(function(err, client) {
       assert.strictEqual(null, err);
       let db = client.db('website');

       postQuestionInfo(req, res, db);
   })
})

app.get('/api/coding/questions/info/:question', (req, res) => {
    DB_client.connect(function(err) {
        assert.strictEqual(null, err);
        let db = DB_client.db('website');

        getQuestionInfo(req, res, db);

    })
})

app.put('/api/coding/questions/info/:question', (req, res) => {
    DB_client.connect(function(err, client) {
        assert.strictEqual(null, err);
        let db = client.db('website');

        putQuestionInfo(req, res, db);
    })
})

app.get('/api/coding/questions/:question', (req, res) => {
    DB_client.connect(function(err) {
        assert.strictEqual(null, err);
        let db = DB_client.db('website');

        getQuestion(req, res, db);
    })
})

app.put('/api/coding/questions/:question', (req, res) => {
    DB_client.connect(function(err) {
        assert.strictEqual(null, err);
        let db = DB_client.db('website');

        putQuestion(req, res, db);
    })
})

app.delete('/api/coding/questions/:question', (req, res) => {
    DB_client.connect(function(err, client) {
        assert.strictEqual(null, err);
        let db = client.db('website');

        deleteQuestion(req, res, db);
    })
})

app.post('/api/coding/run/:lang', postRunCode);


//ClASS INTERFACE
app.get('/api/classes', (req, res) => {
    DB_client.connect(function(err) {
        assert.strictEqual(null, err);
        let db = DB_client.db('website');

        getAllClasses(req, res, db);
    })
})

// class: {title, info, theme, docs}
app.get('/api/classes/:class', (req, res) => {
    DB_client.connect(function(err) {
        assert.strictEqual(null, err);
        let db = DB_client.db('website');

        getClass(req, res, db);
    })
})

app.post('/api/classes', (req, res) => {
    DB_client.connect(function(err) {
        assert.strictEqual(null, err);
        let db = DB_client.db('website');

        /* now using postClass to create a new class assuming the names of classes which already exist won't
        * be used. this is true if users create new classes from website checking duplicates. However, it should
        * be fixed using mondoDB functionality to create a new document if there isn't a document matched with a query.
         */
        postClass(req, res, db);

    })
})

app.put('/api/classes/:class', (req, res) => {
    DB_client.connect(function(err) {
        assert.strictEqual(null, err);
        let db = DB_client.db('website');

        putClass(req, res, db);
    })
})

app.delete('/api/classes/:class', (req, res) => {
    DB_client.connect(function(err) {
        assert.strictEqual(null, err);
        let db = DB_client.db('website');

        deleteClass(req, res, db);
    })
})

// doc: {blobs}
app.get('/api/classes/:class/:docId', (req, res) => {
    DB_client.connect(function(err) {
        assert.strictEqual(null, err);
        let db = DB_client.db('website');

        getDoc(req, res, db);
    })
})

app.post('/api/classes/:class', (req, res) => {
    DB_client.connect(function (err) {
        assert.strictEqual(null, err);
        let db = DB_client.db('website');

        postDoc(req, res, db);
    })
})

app.put('/api/classes/:class/:docId', (req, res) => {
    DB_client.connect(function(err) {
        assert.strictEqual(null, err);
        let db = DB_client.db('website');

        putDoc(req, res, db);
    })
})

app.delete('/api/classes/:class/:docId', (req, res) => {
    DB_client.connect(function(err) {
        assert.strictEqual(null, err);
        let db = DB_client.db('website');

        deleteDoc(req, res, db);
    })
})

app.listen(3001, 'localhost');
