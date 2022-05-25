const lstrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const user = require('../model/user.mongo')

module.exports = function(passport){
    passport.use(new lstrategy((username,password,done)=>{
        user.findOne({
            username:username
        },function (err,user){
            if(err){
                console.log(error);
            };
            if(!user){
                console.log("Error");
                return done(null,false,{message:'User does not exist'})
            }
            bcrypt.compare(password,user.password,(err,result)=>{
                if(err){
                    console.log(err);
                    return done(err)
                }
                if(result === true){
                    return done(null,user,{
                        message:'User found'
                    })
                }else{
                    return done(null,false,{
                        message:'Incorrect Password'
                    })
                }
            })
        })
    }));
    //serialization
    passport.serializeUser((user,cb)=>{
        cb(null,user.userid)
    });
    passport.deserializeUser((id,cb)=>{
        user.findOne({
            userid:id
        },(err,user)=>{
            cb(err,user)
        })
    })
}

