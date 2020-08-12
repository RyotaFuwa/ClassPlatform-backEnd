const fetch = require('node-fetch');
const mongodb = require('mongodb');
const assert = require('assert');

const getAllClasses = (req, res, db) => {
    db.collection('class').find({})
        .project({_id: 0})
        .toArray(function(err, clss) {
            assert.strictEqual(null, err);
            res.send({classes: clss});
        }
    )
}

const getClass = (req, res, db) => {
    db.collection('class').find({title: req.params.class})
        .project({_id: 0})
        .toArray((err, cls) => {
            assert.strictEqual(null, err);
            if(cls.length === 1) //title is supposed to be primary key.
                res.send(cls[0])
        }
    )
}

//HACK: find a way to insert if there isn't something like this at once.
const postClass = (req, res, db) => {
    db.collection('class').find({title: req.body.class.title})
        .toArray((err, cls) => {
            if(cls.length !== 0) {
                res.sendStatus(409);
            }
            else {
                db.collection('class').insertOne(req.body.class, function(err, result) {
                    assert.strictEqual(null, err);
                    res.sendStatus(201);
                });
            }
        }
    )
}

const putClass = (req, res, db) => {
    let cls = req.body.class;
    console.log(cls);
    db.collection('class').updateOne(
        {title: req.params.class},
        {$set: {...cls}},
        {'upsert': true},
        (err, result) => {
            assert.strictEqual(null, err);
            res.sendStatus(201)
        }
    )
}

const deleteClass = (req, res, db) => {
    // what if delete elem doesn't exsist?
    db.collection('class').findOneAndDelete({title: req.params.class}, function(err, result) {
        assert.strictEqual(null, err);
        console.log(result);
        /*
        db.collection('doc').deleteMany({class: req.params.class}, function(err, result) {
            assert.strictEqual(null, err);
        });
         */
        res.send(200);
    });
}

const getDoc = (req, res, db) => {
    db.collection('doc').find({_id: new mongodb.ObjectID(req.params.docId)})
        .project({_id: 0})
        .toArray(function(err, doc) {
            assert.strictEqual(null, err);
            res.send({doc: doc[0]});
        }
    )
}

const postDoc = (req, res, db) => {
    db.collection('doc').insertOne(req.body.doc, function (err, result) {
        assert.strictEqual(null, err);
        res.send({_id: result.insertedId})
    });
}

const putDoc = (req, res, db) => {
    let doc = req.body.doc;
    db.collection('doc').update(
        {_id: new mongodb.ObjectID(req.params.docId)},
        {$set: {...req.body.doc}},
        {'upsert': true},
        (err, result) => {
            if(err !== null) {
                res.sendStatus(500);
            } else {
                res.sendStatus(201);
            }
        }
    )
}

const deleteDoc = (req, res, db) => {
    db.collection('doc').deleteOne({_id: new mongodb.ObjectID(req.params.docId)}, function(err, result) {
        assert.strictEqual(null, err);
        res.send(200);
    })
}

module.exports = {getAllClasses, getClass, postClass, putClass, deleteClass, getDoc, postDoc, putDoc, deleteDoc};
