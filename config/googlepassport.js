const {Strategy} = require('passport-google-oauth20')
const AUTH_OPTIONS = {
    callbackURL:'/auth/google/callback',
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET
}

function verifyCallback(accesstoken,refreshtoken,profile,done){
    console.log(profile)
    done(null,profile)
}

module.exports = function(passport){
    passport.use(new Strategy(AUTH_OPTIONS,verifyCallback))
}