const express = require('express')
const Chatroom = require('../model/Chatroom')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const checkAuth = require('../middleware/check-auth')



const router = express.Router();


  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(bodyParser.json());
  router.use(bodyParser.raw());

router.get('/findAll', checkAuth, async (req, res) => {
    try{
        const chatrooms = await Chatroom.find();
        res.json(chatrooms)
    } catch(err){
        res.status().json({ message: err.message})
    }
})

router.post('/create', checkAuth, (req, res, next) => {
        var chatroom = new Chatroom({ 
            _id: new mongoose.Types.ObjectId(),
            name: req.body.chatroom.name,
            type: req.body.chatroom.type,
            password: req.body.chatroom.password
        })
        chatroom.save().then(result =>{
            res.send(result)
        }).catch( err =>{
            res.status().json({ message: err.message})
        })
})

router.get('/:chatroomId', checkAuth, async (req, res) => {
    try{
    const chatroom = await Chatroom.findById(req.params.chatroomId);
    res.json(chatroom)
    } catch(err){
        res.status().json({ message: err.message})
    }
})



module.exports = router;