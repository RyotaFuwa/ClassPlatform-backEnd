const fetch = require('node-fetch');
const assert = require('assert');

/* API Handler.
 */

// CODING API
const getAllQuestionInfo = (req, res, db) => {
    db.collection('questionInfo').find({})
        .project({_id: 0})
        .toArray(function (err, questions) {
            assert.strictEqual(null, err);
            res.send({questions: questions});
        })
}

const getQuestionInfo = (req, res, db) => {
    db.collection('questionInfo').find({'title': req.params.question})
        .project({_id: 0})
        .toArray((err, question) => {
            assert.strictEqual(null, err);
            if(question.length === 1) //title is supposed to be primary key.
                res.send(question[0])
    })
}


//HACK: find a way to insert if there isn't something like this at once.
const postQuestionInfo = (req, res, db) => {
    let question = req.body.question;
    let isInvalidQuestion = question.title === 'Coding Room';
    if(isInvalidQuestion) {
        res.sendStatus(409);
    }
    else {
        db.collection('questionInfo').find({'title': question.title})
            .toArray((err, result) => {
                isInvalidQuestion = result.length !== 0;
            })
        if (isInvalidQuestion) {
            res.sendStatus(409);
        } else {
            db.collection('questionInfo').insert(question, function (err, result) {
                assert.strictEqual(null, err);
                let newQuestion = {title: question.title, instruction: '', helps: [], tests: [], pseudo: ''};
                db.collection('question').insert(newQuestion);
                res.sendStatus(201);
            })
        }
    }
}

const putQuestionInfo = (req, res, db) => {
    let question = req.body.question;
    db.collection('questionInfo').replaceOne(
        {'title': req.params.question},
        question,
        {'upsert': true},
        (err, result) => {
            if(err !== null || result.modifiedCount !== 1) {
                res.sendStatus(500);
            } else {
                res.sendStatus(201);
            }
        }
    )
}


const getQuestion = (req, res, db) => {
    db.collection('question').find({'title': req.params.question})
        .project({_id: 0})
        .toArray((err, question) => {
            assert.strictEqual(null, err);
            if(question.length === 1) //title is supposed to be primary key.
                res.send(question[0])
    })
}

const putQuestion = (req, res, db) => {
    let question = req.body.question;
    question = {...question, title: req.params.question};
    db.collection('question').replaceOne(
        {'title': req.params.question},
        question,
        {'upsert': true},
        (err, result) => {
            assert.strictEqual(null, err);
            res.sendStatus(200);
    })
}

const deleteQuestion = (req, res, db) => {
    // what if delete elem doesn't exsist?
    db.collection('questionInfo').findOneAndDelete({title: req.params.question}, function(err, result) {
        assert.strictEqual(null, err);
        db.collection('question').findOneAndDelete({title: req.params.question}, function(err, result) {
            assert.strictEqual(null, err);
            res.send(200);
        });
    });
}


const postRunCode = (req, res) => {
        fetch(`https://run.glot.io/languages/${req.params.lang}/latest`, {
            method: 'POST',
            timeout: 5000,
            headers: {
                'Authorization': 'Token 2c2634e4-ecc3-446e-bace-2c030900dc64',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({files: [{name: 'main', content: req.body.content}]}),
        })
            .then(result => result.json())
            .then(json => res.send(json))
            .catch(() => res.sendStatus(500));
}

module.exports = {getAllQuestionInfo, getQuestionInfo, postQuestionInfo, putQuestionInfo, getQuestion,
    putQuestion, deleteQuestion, postRunCode};
