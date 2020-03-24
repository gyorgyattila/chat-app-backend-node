let mongoose = require('../config/index')


let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    avatar: { 
        data: Buffer, 
        contentType: String 
    },
    socket: {
        type: String
    }
})

userSchema.methods.excludePassword = function () {
    this.password = null;
}

const User = mongoose.model('User', userSchema);

module.exports = User;