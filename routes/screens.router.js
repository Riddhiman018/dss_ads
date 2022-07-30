const express = require('express')
const router = express.Router()
const user = require('../model/user.mongo')
const common = require('../model/admin.mongo')

router.post('/addScreen',async (req,res)=>{
    //req.body should be done in json
    //req.body.devicedetail(IP or Random Assignment etc. if Random Assignment then socket connection IP should be unique)
    try {
        console.log("screen name")
        console.log(req.body.screenname)
        const newuser = user.findOneAndUpdate({
            username:req.user.username
        },{'$push':
            {
                screen:req.body.deviceId+"/"+req.body.screenname
            }
        })
        if(newuser){
            res.status(200).send(req.user);
        }
    } catch (error) {        
        res.status(404).send({
            Message:error.Message
        })
    }
})
router.get('/generateNumber',async (req,res)=>{
    const code = Date.now().toString()
    const number = code.slice(code.length-10).slice(-6)
    common.findOne({
        USED_DEVICE_CODE:number
    },async function(error,result){
        if(error){
            res.status(404).send({
                Message:'Error in Code Generation'
            })
        }
        else{
            if(!result){
                const newcode = new common({
                    USED_DEVICE_CODE:number
                })
                try {
                    const result = await newcode.save()
                    if(result){
                        res.status(200).send({
                            Message:`${number}`
                        })
                    }
                } catch (error) {
                    res.status(404).send({
                        Message:'Could not save code'
                    })
                }
            }
        }
    })
})
module.exports = router