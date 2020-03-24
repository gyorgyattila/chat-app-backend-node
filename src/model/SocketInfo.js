let mongoose = require('../config/index')


let socketInfoSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    socketId: String,
    userId: String,
    chatroomId: String
});

const SocketInfo = mongoose.model('SocketInfo', socketInfoSchema);

module.exports = SocketInfo;