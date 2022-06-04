const express = require('express')
const router = express.Router()
const passport = require('passport')
const sample = require('../functions/sampleUser')
const {ensureLogin,isregistered} = require('../middlewares/ensure_login')
const socketio = require('socket.io')
const multer = require('multer')
const fs = require('fs')
const user = require('../model/user.mongo')
const path = require('path')
const aws = require('aws-sdk')
const {uploadFile} = require('../controller/fileUpload')


const s3 = new aws.S3({
    accessKeyId:'AKIAVCSZ2D56JWCNDC5M',
    secretAccessKey:'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',
    region:'ap-south-1'
})

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        console.log(file);
        if(!fs.existsSync('videofiles')){
            fs.mkdirSync('videofiles')
        }
        cb(null,'videofiles')
    },
    filename:function(req,file,cb){
        console.log(file);
        cb(null,file.originalname);
    }
})

const upload = multer({
    storage:storage
    // fileFilter:function(req,file,cb){
    //     var ext = path.extname(file.originalname)
    //     if(ext!='.mkv'&& ext!='.mp4'){
    //         return cb(new Error("Only videofiles"))
    //     }
    // }
})

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

router.post('/addVideos',upload.single('postedvideos'),async (req,res)=>{
    console.log(req.file)
    try {
        const res = await uploadFile(req.file)
        console.log(res);
    } catch (error) {
        console.log(error);
        res.status(404).send({
            Message:'Error in file upload'
        })
    }
    // user.updateOne({
    //     username:"Chandan Singh"
    // },{
    //     $addToSet:{
    //         videos:[req.file.path]
    //     } 
    // },function(err,result){
    //     if(err){
    //         res.status(404).send({
    //             Message:'Error in Video Updating'
    //         })
    //     }
    //     else{
    //         res.status(200).send({
    //             Message:'Uploaded the video'
    //         })
    //     }
    // })
})

router.post('/getVideos',async (req,res)=>{
    try {
        const user = await user.findOne({
            username:"Chandan Singh"
        })
        if(user){
            res.status(200).send({
                Message:'User found',
                videos:user.videos
            })
        }
        else{
            res.status(404).send({
                Message:'User not found'
            })
        }
    } catch (error) {
        res.status(404).send({
            Message:error.Message
        })
    }
})

module.exports = router