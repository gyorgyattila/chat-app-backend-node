let mongoose = require('../config/index')
const User = require('./User')


let messageSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    text: String,
    createdAt: Date,
    user: User.schema,
});


const Message = mongoose.model('Message', messageSchema);

module.exports = Message;