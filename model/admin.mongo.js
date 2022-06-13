const mongoose = require('mongoose')
const commondb = new mongoose.Schema({
    USED_DEVICE_CODE:{
        type:String
    }
})
module.exports = mongoose.model('commondb',commondb)
