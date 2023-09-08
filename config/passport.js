const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports = function() {
    // Use local strategy
    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
              return done(null, false, { message: "Incorrect username" });
            };
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
              return done(null, false, { message: "Incorrect password" });
            };
            return done(null, user);
          } catch(err) {
            return done(err);
          };
    }));

    // Serialize user
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // Deserialize user
    passport.deserializeUser(async function(id, done) {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch(err) {
            done(err);
        };
    });
};