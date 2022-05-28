const express = require('express')
const router = express.Router()
const passport = require('passport')
const sample = require('../functions/sampleUser')
const {ensureLogin} = require('../middlewares/ensure_login')
const socketio = require('socket.io')

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

router.get('/connectdevice',ensureLogin,async (req,res)=>{
    //get should contain device code
    //create socket connection with device
    //add it to room of devices
    //set the unique deviceID 
    const io = req.app.get('socketio')
    //broadcast the entire msg/// if a device has the particular device ID then that device will respond
    //set the emit arguement as the device id
    //if we receive the socket msg from the server
    //we respond it back with the same socket msg
    io.emit(`${req.query.deviceID}`);
    io.on(`${req.query.deviceID}`,(obj)=>{
        if(obj.id===req.query.deviceID){
            res.status(200).send({
                Message:'Device Connected Successfully'
            })
        }
    })
})

module.exports = router