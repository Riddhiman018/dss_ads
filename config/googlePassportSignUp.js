const {Strategy} = require('passport-google-oauth20')
const user = require('../model/user.mongo')
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
    passport.serializeUser(function(user,done){
        console.log(user);
        done(null,user.userid)
    })
    passport.deserializeUser((id,cb)=>{
        user.findOne({
            userid:id
        },(err,user)=>{
            cb(null,user)
            console.log(user);
        })
    })
}