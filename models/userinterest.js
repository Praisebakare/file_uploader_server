const mongoose = require('mongoose')

const interestSchema = new mongoose.Schema(
    { 
        username: {type: String, required: true, unique:true},
        interest: Array
    },
    {collection: 'interest'}
)

const interest = mongoose.model('interestSchema', interestSchema)

module.exports = interest