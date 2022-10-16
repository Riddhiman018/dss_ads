const mongoose = require('mongoose')
const video  = new mongoose.Schema({
    length:{
        type:Number
    },
    url:{
        type:String
    },
    thumbnail_url:{
        type:String
    }
})
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
        required:false,
    }, 
    screens:{
        type:[String]
        
    },
    videos:{
        type:[String],
        default:[]
    },
    playlists:{
        type:[]
    },
    video_list:{
        type:[video]
    }
})

module.exports = mongoose.model('user',userSchema)