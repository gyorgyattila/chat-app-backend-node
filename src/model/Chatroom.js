let mongoose = require('../config/index')
const Message = require('./Message')
const User = require('./User')



let chatroomSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    members: [User.schema],
    messages: [Message.schema],
    type: String,
    password: String
});

const Chatroom = mongoose.model('Chatroom', chatroomSchema);

module.exports = Chatroom;