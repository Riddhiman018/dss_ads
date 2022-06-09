const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    userid:{
        type:Number,
        default:234556
    },
    username:{
        type:String, 
        required:true
    },
    password:{
        type:String,
        required:true,
    }, 
    screens:{
        type:[String],
        default:[]
    },
    videos:{
        type:[String],
        default:[]
    },
    playlists:{
        type:[]
    }
})

module.exports = mongoose.model('user',userSchema)