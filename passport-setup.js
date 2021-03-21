const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy=require('passport-facebook')

passport.serializeUser(function(user, done) {
    done(null, user);
  });

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: "822898975970-f09bqtmgnrq3hgjhi76vbqi1ko98om5l.apps.googleusercontent.com",
    clientSecret: "XPhW7g0XZiURIW8uiy5Bz-jX",
    callbackURL: "http://localhost:4000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
))

passport.use(new FacebookStrategy({
        clientID: "1775499352628133",
        clientSecret: "00a02fa75454e97fd1743116854c5116",
        callbackURL: "http://localhost:4000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
))





