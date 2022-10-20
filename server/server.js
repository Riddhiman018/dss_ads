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
const googleSignUp = require('../config/googlePassportSignUp')
const user = require('../model/user.mongo')
const cors = require('cors')

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
app.use(session({
    saveUninitialized:true,
    resave:true,
    secret:'SECRETVALUE',
    store: MongoStore.create({mongoUrl:uri})
}))
app.use(passport.initialize())
app.use(passport.session())
strategy(passport)
googleFunction(passport)
app.use(screenrouter)
app.use(require('../routes/user.router'))
const server = http.createServer(app)


const port = process.env.PORT||4000
server.listen(port,()=>{
    
    console.log('Listening...')
})

const io = new Server(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
}})



io.on("connection",(socket)=>{
    socket.on("connectClient",(obj)=>{
        console.log(socket.id)
        console.log(obj)
        const clientID = obj.id
        const screenname=obj.screenname
        console.log(screenname);
        console.log(obj.id);
        io.emit(`${clientID}`,{
            clientID:clientID
        });
        socket.join(`${clientID}`)
        user.updateOne({
            username:obj.username
        },{
            $addToSet:{
                screens:clientID+"-"+screenname
            }
        },function(error,result){
            if(error){
                console.log(error)
                io.to(clientID).emit('screen-not-added')
            }
            else{
                console.log('screen added')
                io.to(clientID).emit("screen added")
            }
        })
    })
    socket.on(`connect-to-server`,(obj)=>{  //socket event to be emitted from android with json obj containing the code as clientID
        console.log('Socket post from mobile');
        console.log(obj)
        if(!obj){
            console.log('Received Socket post from android')
        }
        else{
            const objkt = obj //obj is a JSON
            const clientID = objkt.clientID   // clientID in a string
            socket.join(clientID) //joining done
            io.to(clientID).emit(`${clientID}-room-joined`) //No object being sent, simply an event to switch to display mode     
        }
    })
    socket.on("changevideo",(objt)=>{
        console.log(socket.id)
        console.log(objt)
        const username = objt.username
        const clientID = objt.id //client id in a string
        console.log(clientID);
        user.findOne({
            username:username
        },function(error,result){
            if(error){
                console.log(error);
            }
            else{
                console.log(result)
                console.log(result.playlists);
                result.screens.forEach(element => {
                    console.log(element)
                    const ele = element.split("-")[0]
                    io.to(ele).emit('changevideo',{
                        array:result.playlists
                    }) 
                });
            }
        })
    })
})

