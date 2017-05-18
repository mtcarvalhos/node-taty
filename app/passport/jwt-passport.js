'use strict'
const
    passport = require('passport'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    mongojs = require('mongojs'),
    config = require('../../config/config'),
    db = mongojs(config.MONGODB, ['works']);

let jwt = () => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = config.SECRET;
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        db.works.findOne({ id: jwt_payload.id }, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
               
                done(null, false);
            }
        });
    }));
}


module.exports = jwt;