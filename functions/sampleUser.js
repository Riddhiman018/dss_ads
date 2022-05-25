const user = require('../model/user.mongo')
const bcrypt = require('bcrypt')
async function createUser(usr,pwd){
    const salt = await bcrypt.genSalt(10)
    const pw = await bcrypt.hash(pwd,salt) 
    const us = new user({
        username:usr,
        password: pw
    })
    try {
        await us.save()
    } catch (error) {
        console.log(error);
        throw error
    }
}
module.exports = createUser