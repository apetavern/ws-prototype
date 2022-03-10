const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;

passport.use(
    new SteamStrategy({
        returnURL: 'http://localhost:3000/steam/callback',
        realm: 'http://localhost:3000',
        apiKey: process.env.STEAM_API_KEY
    },
    (identifier, profile, done) => {
        // Save the profile to the database here.
        console.log(profile);
        console.log(identifier);
        return done(null, profile);
    })
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

module.exports = passport;