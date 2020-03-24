require('dotenv').config({path: __dirname + '/.env'})
const environment = require('./config/environment');
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const chatroomRoute = require('./routes/chatroom')
const userRoute = require('./routes/user');
const cors = require('cors'); 
const socketService = require('./service/SocketService')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

socketService(io)

const port = environment.PORT || 3000

app.use(cors());
app.use('/chatroom', chatroomRoute)
app.use('/user', userRoute)


server.listen(port, () => {

})

