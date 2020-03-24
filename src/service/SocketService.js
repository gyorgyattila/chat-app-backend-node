
const Message = require('../model/Message')
const Chatroom = require('../model/Chatroom')
const mongoose = require('mongoose');
const SocketInfo = require('../model/SocketInfo');

module.exports = function (io) {
    io.on('connection', (socket) => {
        console.log("New Websocket connection")
    
        socket.on('sendMessage', async (data) => {
            var message = new Message({ 
                _id: new mongoose.Types.ObjectId(),
                text: data.message.text,
                createdAt: data.message.createdAt,
                user: data.message.user
            })
            Chatroom.findOneAndUpdate({_id: data.chatroomId}, { $push: {"messages": message} }, {new: true}).then(result => io.emit('chatroom', result))
        })
    
        socket.on('joinUser',  async (data) =>{
            var socketInfo = await SocketInfo.findOne({userId: data.user._id});
            if(socketInfo){
                socketInfo.chatroomId = data.chatRoom._id
            }else {
                socketInfo = new SocketInfo({ 
                    _id: new mongoose.Types.ObjectId(),
                    userId: data.user._id,
                    socketId: socket.id,
                    chatroomId: data.chatRoom._id
                })
            }
            socketInfo.save();
            await Chatroom.findOneAndUpdate({_id: data.chatRoom._id}, { $addToSet: {"members": data.user} }, {new: true}).then(result => io.emit('members', result) )
        })
    
        socket.on('userLeft', async (data) => {
            await Chatroom.findOneAndUpdate({_id: data.previouseChatroom._id}, { $pull: {"members": {"username": data.user.username}} }, {new: true}).then(result => io.emit('members', result));
        })
    
        socket.on('disconnect', async () => {
            console.log("user disconnected")
            var socketInfo = await SocketInfo.findOne({socketId: socket.id})
            if(socketInfo){
                console.log("user disconnected" + socketInfo.userId)
                await Chatroom.findOneAndUpdate({_id: socketInfo.chatroomId}, { $pull: {"members": {_id: socketInfo.userId}} }, {new: true})
                .then(async result => {
                    await SocketInfo.deleteOne({socketId: socket.id})
                    io.emit('members', result)
                })
            }
         });
    
    })
}