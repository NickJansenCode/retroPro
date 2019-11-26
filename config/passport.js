// NPM IMPORTS //
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
require('dotenv').config();
const mongoose = require('mongoose');

// MODEL IMPORTS //
const User = mongoose.model('users');


const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// eslint-disable-next-line no-undef
opts.secretOrKey = process.env.JWTSECRET;

/**
 * Honestly I'm not 100% sure what this does but it's really important.
 */
module.exports = (passport) => {
    passport.use(
        new JwtStrategy(opts, (jwtPayload, done) => {
            User.findById(jwtPayload.id)
                .then((user) => {
                    if (user) {
                        return done(null, user);
                    }
                    return done(null, false);
                })
                .catch((err) => console.log(err));
        }),
    );
};
