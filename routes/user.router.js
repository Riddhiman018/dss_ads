const express = require('express')
const router = express.Router()
const passport = require('passport')
const sample = require('../functions/sampleUser')

router.get('/createSample',async (req,res)=>{
    try {
        await sample("Chandan Singh","Hello123")
        res.status(200).send({
            Message:"Testing"
        })
    } catch (error) {
        console.log(error);
        res.status(404).send({
            Message:"Error in user creation"
        })
    }
})
router.get('/login',(req,res)=>{
    res.render('login')
})
router.post('/login',(req,res,next)=>{
    passport.authenticate("local",(err,user,info)=>{
        console.log(err);
        console.log(user);
        console.log(info);
        req.logIn(user,(error)=>{
            if(error){
                console.log(error);
            }
            else{
                res.status(200).send(req.user)
            }
        })
    })(req,res,next)
})

module.exports = router