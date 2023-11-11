const mongoose = require('mongoose')

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('DB CONNECT SUCCESS!!')
    } catch (error) {
        console.log('CONNECT TO DB ERROR!')
    }
}