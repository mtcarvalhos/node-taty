const
    express = require('express'),
    passport = require('passport'),
    mongojs = require('mongojs'),
    config = require('../config/config'),
    db = mongojs(config.MONGODB, ['users']),
    Auth = require('../app/helper/auth'),
    jwt = require('jsonwebtoken'),
    AuthMiddleware = require('../app/middleware/auth-middleware'),
    router = express.Router();

const rp = passport.authenticate('jwt', { session: false });
const rl = AuthMiddleware.requireLogin;

router.get('/users', rp, rl, (req, res) => {
    db.users.find(function (err, data) {
        res.json({ data: data });
    })
});

router.get('/user/:userID', rp, rl, (req, res) => {
    db.users.findOne({ _id: mongojs.ObjectId(req.params.userID) }, function (err, data) {
        console.log(data)
        res.json({ data: data });
    });
})

router.post('/user', rp, rl, (req, res) => {
    Auth.encrypt_password(req.body.password, (hash) => {
        const body = req.body;
        body['password'] = hash;
        body['created_at'] = Date.now();
        db.users.save(body, (err, result) => {
            res.json(result)
        });
    });
})

router.put('/user/:userID', rp, rl, (req, res) => {
    const body = req.body;
    body['modified_at'] = Date.now();
    db.users.findAndModify({
        query: { _id: mongojs.ObjectId(req.params.userID) },
        update: { $set: body },
        new: true
    }, (err, result, lastErrorObject) => {
        res.json(result);
    })

})

router.delete('/user/:userID', rp, rl, (req, res) => {
    db.users.remove(
        { _id: mongojs.ObjectId(req.params.userID) }, {}, (err, result) => {
            res.json(result)
        })
});

router.post('/user/auth', (req, res) => {
    db.users.findOne({
        email: req.body.email
    }, (err, user) => {
        if (err) return console.log(err);
        if (!user) {
            return res.json({ success: false, 'msg': 'Falha no login: Usuario não existe' });
        } else {
            Auth.compare_password(req.body.password, user.password, (err, isMatch) => {
                if (isMatch && !err) {
                    const token = jwt.sign(user, config.SECRET, { expiresIn: "24h" }); 
                    return res.json({ 'success': true, token: 'JWT ' + token });
                } else {
                    return res.json({ 'success': false, msg: 'Auth failed, Wrong password' });
                }
            });
        }
    })
}); 

module.exports = router;    