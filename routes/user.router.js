const express = require('express')
const router = express.Router()
const passport = require('passport')
const sample = require('../functions/sampleUser')
const {ensureLogin,isregistered} = require('../middlewares/ensure_login')
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
router.post('/register',isregistered,async (req,res)=>{
    try{
        await sample(req.body.username,req.body.password)
    }catch(error){
        res.status(404).send({
            Message:error.Message
        })
    }    
})
router.post('/login',ensureLogin,(req,res,next)=>{
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
//temporary add device view
router.get('/connectdevice',async (req,res)=>{
    //get should contain device code
    //create socket connection with device
    //add it to room of devices
    //set the unique deviceID 
    const io = req.app.get('socketio')
    const socket = req.app.get('socketobj')
    //broadcast the entire msg/// if a device has the particular device ID then that device will respond
    //set the emit arguement as the device id
    //if we receive the socket msg from the server
    //we respond it back with the same socket msg
    //io.emit(`${req.query.deviceID}`);
    socket.emit(`${req.query.deviceID}`,{
        Message:'Connected'
    });
    res.status(200).send({
        Message:'Device Connected Successfully'
    })
    // socket.on(`${req.query.deviceID}`,(obj)=>{
    //     console.log(obj);
    //     if(obj.id===req.query.deviceID){
    //         res.status(200).send({
    //             Message:'Device Connected Successfully'
    //         })
    //     }
    // })
})

module.exports = router