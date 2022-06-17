const user = require('../model/user.mongo')

function ensureLogin(req,res,next){
    if(req.isAuthenticated()){
        console.log(req.user);
        next()
    }
    else{
        res.redirect('/login')
    }
}
async function isregistered(req,res,next){
    console.log('Entered Middleware')
    const username = req.body.username
    console.log(username)
    try{
        const us = await user.findOne({
            username:username
        })
        console.log(us)
        if(us){
            res.status(200).send({
                Message:'User exists already'
            })
        }
        else{
            next()
        }
    }catch(error){
        res.status(404).send({
            Message:error.Message
        })
    }
}
module.exports = {
    ensureLogin,
    isregistered
}
