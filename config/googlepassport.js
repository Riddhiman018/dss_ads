require('dotenv').config()

const {Strategy} = require('passport-google-oauth20')
const user = require('../model/user.mongo')

const AUTH_OPTIONS = {
    callbackURL:'/auth/google/callback',
    clientID:"753941913635-6s7icje20h1l35qs2jbglgc5r5habnqc.apps.googleusercontent.com",
    clientSecret:"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"
}

// const AUTH_OPTIONS = {
//     callbackURL:'/auth/google/callback',
//     clientID:process.env.CLIENT_ID,
//     clientSecret:process.env.CLIENT_SECRET
// }

function verifyCallback(accesstoken,refreshtoken,profile,done){
    console.log("profile:",profile)
    user.findOne({
        username: profile.emails[0].value 
    }, function(err, User) {
        if (err) {
            return done(err);
        }
        if (!User) {
            User = new user({
                username: profile.emails[0].value,
                
            });
            User.save(function(err) {
                if (err) console.log(err);
                return done(err, User);
            });
        } else {
            return done(err, User);
        }
    }); 
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
            console.log("user",user);
        })
    })
}



