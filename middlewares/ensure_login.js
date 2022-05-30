const user = require('../model/user.mongo')

function ensureLogin(req,res,next){
    if(req.isAuthenticated()){
        next()
    }
    else{
        res.redirect('/login')
    }
}
async function isregistered(req,res,next){
    const username = req.body.username
    try{
        const us = await user.find({
            username:username
        })
        if(!us){
            next()
        }
        else{
            res.status(200).send({
                Message:'User exists already'
            })
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
