const express = require('express'),
    passport = require('passport'),
    mongojs = require('mongojs'),
    config = require('../config/config'),
    db = mongojs(config.MONGODB, ['works']),
    AuthMiddleware = require('../app/middleware/auth-middleware'),
    router = express.Router();

const rp = passport.authenticate('jwt', {session: false});
const rl = AuthMiddleware.requireLogin;


router.get('/works', (req, res) => {
    db.works.find().sort({created_at: -1}, function(err, data) {
        res.json({ data: data });
    })
});

router.get('/work/:workID', rp, rl, (req, res) => {
    db.works.findOne({ _id: mongojs.ObjectId(req.params.workID) }, function(err, data){
        console.log(data)
        res.json({ data: data });
    });
})

router.post('/work', rp, rl, (req, res) => {
    const body = req.body;
    body['created_at'] = Date.now();
    db.works.save(body, (err, result) => {
        res.json(result)
    })
})

router.put('/work/:workID', rp, rl, (req, res) => {
    const body = req.body;
    body['modified_at'] = Date.now();
    db.works.findAndModify({
        query: { _id: mongojs.ObjectId(req.params.workID) },
        update: { $set: body },
        new: true
    }, (err, result, lastErrorObject) => {
        res.json(result);
        })
    
})

router.delete('/work/:workID', rp, rl, (req, res) => {
    db.works.remove(
        { _id: mongojs.ObjectId(req.params.workID) }, {}, (err, result) => {
            res.json(result)
        })
});

module.exports = router;    