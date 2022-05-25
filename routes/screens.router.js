const express = require('express')
const router = express.Router()
const user = require('../model/user.mongo')
router.post('/addScreen',async (req,res)=>{
    //req.body should be done in json
    //req.body.devicedetail(IP or Random Assignment etc. if Random Assignment then socket connection IP should be unique)
    try {
        const newuser = user.findOneAndUpdate({
            username:req.user.username
        },{'$push':
            {
                screen:req.body.deviceId
            }
        })
        if(newuser){
            res.status(200).send({
                Message:'Successfully Added a Screen'
            })
        }
    } catch (error) {        
        res.status(404).send({
            Message:error.Message
        })
    }
})
module.exports = router