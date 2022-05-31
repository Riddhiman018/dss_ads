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

//dbconnection
const uri = "mongodb+srv://Riddhiman_Mongo:Hello123@mologtempcluster.z42bl.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect("mongodb+srv://Riddhiman_Mongo:Hello123@mologtempcluster.z42bl.mongodb.net/DS_MOLOG?retryWrites=true&w=majority")

const app = express()
//add session
//add Logger
//add morgan
//add passport session and initalise
app.set('view engine','ejs')
const screenrouter = require('../routes/screens.router')
app.use(express.urlencoded({
    extended:true
}))
app.use(express.static(`${__dirname}/staticfiles`))
// app.use(flash())
// const strategy = require('../config/passport')
// strategy(passport)
// app.use(session({
//     saveUninitialized:true,
//     resave:true,
//     secret:'SECRETVALUE',
//     store: MongoStore.create({mongoUrl:uri})
// }))

// app.set('socketio',io)
// app.use(passport.initialize())
// app.use(passport.session())
app.use(screenrouter)
app.use(require('../routes/user.router'))

const port = process.env.PORT||4000
const server = http.createServer(app)
server.listen(port,()=>{
    console.log('Running...');
})
const io = new Server(server)
io.on("connection",(socket)=>{
    socket.on("connectClient",(obj)=>{
        const clientID = obj.id
        console.log(obj.id);
        io.emit(`${clientID}`,{
            clientID:clientID
        });
    })
    socket.on(`connect-to-db`,(obj)=>{
        console.log(clientID);
        console.log(obj.id);
        if(obj.id==obj.clientID){
            console.log(obj.id + 'Namaste');
        }
    })

})

