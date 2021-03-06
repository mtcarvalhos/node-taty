'use strict';
const bcrypt = require('bcrypt-nodejs'),
    config = require('../../config/config'),
    mongojs = require('mongojs'),
    db = mongojs(config.MONGODB, ['users']);
const saltRounds = 10;

let Auth = function () { }


let encode_password = (password, cb) => {
    bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) return false;
        bcrypt.hash(password, salt, null, function(err, hash) {
            if (err) return false;
            return cb(hash)
        })

    })
}

Auth.prototype.encrypt_password = function (password, cb) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) return false;
        bcrypt.hash(password, salt, null, function(err, hash) {
            if (err) return false;
            return cb(hash)
        })

    })

    return password;
}

let compare_pass = (password, password_db, cb) => {
    bcrypt.compare(password, password_db, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch)
    });
}


Auth.prototype.compare_password = function (password, password_db, cb) {
    bcrypt.compare(password, password_db, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch)
    });
}


module.exports = {
    encode_password: encode_password,
    compare_pass: compare_pass
}
/*module.exports.compare_pass = compare_pass;

module.exports = new Auth();*/