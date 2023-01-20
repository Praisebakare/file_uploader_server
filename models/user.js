const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    { 
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true}
    },
    {collection: 'user'}
)

const user = mongoose.model('userSchema', userSchema)

module.exports = user