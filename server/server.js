const express = require('express')
const session = require('express-session')
const flash = require('express-flash')
const morgan = require('morgan')
const http = require('http')
const passport = require('passport')
const {Server} = require('socket.io')
//const MongoStore = require('connect-mongo')(session)
const MongoStore = require('connect-mongo')
const { default: mongoose } = require('mongoose')
require('dotenv').config()
const googleFunction = require('../config/googlepassport')
const user = require('../model/user.mongo')

//dbconnection
const uri = "mongodb+srv://Riddhiman_Mongo:Hello123@mologtempcluster.z42bl.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect("mongodb+srv://Riddhiman_Mongo:Hello123@mologtempcluster.z42bl.mongodb.net/DS_MOLOG?retryWrites=true&w=majority")

const app = express()
//add session
//add Logger
//add morgan
//add passport session and initalise
app.use(cors())
app.set('view engine','ejs')
const screenrouter = require('../routes/screens.router')
app.use(express.urlencoded({
    extended:true
}))
app.use(express.json())
app.use(express.static(`${__dirname}/staticfiles`))
app.use(flash())
const strategy = require('../config/passport')
strategy(passport)
googleFunction(passport)
app.use(session({
    saveUninitialized:true,
    resave:true,
    secret:'SECRETVALUE',
    store: MongoStore.create({mongoUrl:uri})
}))
const io = new Server(server)
io.on("connection",(socket)=>{
    socket.on("connectClient",(obj)=>{
        const clientID = obj.id
        console.log(obj.id);
        io.emit(`${clientID}`,{
            clientID:clientID
        });
    })
    socket.on("changevideo",(obj)=>{
        const username = obj.username
        user.findOne({
            username:username
        },function(error,result){
            if(error){
                console.log(error);
            }
            else{
                io.emit("changevideo",{
                    array:result.playlists
                })
            }
        })
    })
    socket.on(`connect-to-db`,(obj)=>{
        console.log('Socket post from mobile');
        if(!obj){
            console.log('Received Socket post from android')
        }
        else{
            console.log(clientID);
            console.log(obj.id);
            if(obj.id==obj.clientID){
                console.log(obj.id + 'Namaste');
            }    
        }
    })
})

