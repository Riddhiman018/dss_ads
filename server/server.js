const express = require('express')
const session = require('express-session')
const flash = require('express-flash')
const morgan = require('morgan')
const http = require('http')
const passport = require('passport')
//const MongoStore = require('connect-mongo')(session)
const MongoStore = require('connect-mongo')
const { default: mongoose } = require('mongoose')

//dbconnection
const uri = "mongodb+srv://Riddhiman_Mongo:Hello123@mologtempcluster.z42bl.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect("mongodb+srv://Riddhiman_Mongo:Hello123@mologtempcluster.z42bl.mongodb.net/DS_MOLOG?retryWrites=true&w=majority")

const app = express()
const server = http.createServer(app)
//add session
//add Logger
//add morgan
//add passport session and initalise
app.set('view engine','ejs')
const screenrouter = require('../routes/screens.router')
app.use(express.urlencoded({
    extended:true
}))
app.use(flash())
const strategy = require('../config/passport')
strategy(passport)
app.use(session({
    saveUninitialized:false,
    resave:true,
    secret:'SECRETVALUE',
    store: MongoStore.create({mongoUrl:uri})
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(screenrouter)
app.use(require('../routes/user.router'))
server.listen(4000,()=>{
    console.log('Running...');
})


