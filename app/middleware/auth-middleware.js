'use strict';
const
    jwt = require('jsonwebtoken'),
    config = require('../../config/config'),
    mongojs = require('mongojs'),
    db = mongojs(config.MONGODB, ['users']);

exports.requireLogin = (req, res, next) => {
    let token = _getToken(req.headers);
    if (token) {
        let decoded = _decodeThis(token);
        db.users.count({ _id: mongojs.ObjectId(decoded._id) }, (err, data) => {
            if (err) console.log(err);
           
            if (data != 1)
                return res.status(403).send({ success: false, msg: 'Authentication failed. User not found' });
            else
                return next();
        })
    }
}

let _getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

let _decodeThis = (token) => {
    let decoded = jwt.verify(token, config.SECRET);
    return decoded;
}