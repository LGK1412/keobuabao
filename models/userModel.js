const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        select: false
    },
    point: {
        type: Number,
        default: 0
    },
    lastLogin: {
        type: Date,
        select: false
    },
    streak: {
        type: Number,
        default: 0
    },
    isBan: {
        type: Boolean,
        default: false,
        select: false
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)