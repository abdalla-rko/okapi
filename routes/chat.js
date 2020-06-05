const express = require("express");
const router = express.Router();
const User = require('../models/User');
const Room = require('../models/Room');
const authenticateToken = require('../config/jwtToken').authenticateToken;

router.get('/', authenticateToken, async (req, res) => {
  await Room.find().exec((err, names) => {
    const namesArray = [];
    names.forEach((name) =>  namesArray.push(name.name))
    const countUsers = [];
    names.forEach((user) => countUsers.push({countUser: user.users, name: user.name}))
    
    res.render('chatIndex', { 
      rooms: namesArray,
      users: countUsers,
      name: req.user.username,
      title: 'chat'
    })
  });
})

router.post('/room', authenticateToken, async (req, res) => {
  const roomExistDataBase = await Room.findOne({ name: req.body.room })
  if (roomExistDataBase) {
    // todo give a warning that the name already exist
    return res.redirect('/chat')
  }
  const userid = req.user._id;  
  const chatRoom = new Room({
    name: req.body.room,
    users: {
      username: req.user.username,
      userId: userid,
      socketId: ""
    },
    chats: []
  })
  chatRoom.save();
  
  res.redirect(`/chat/${req.body.room}`)
  req.io.emit('room-created', req.body.room)
})

router.get('/:room', authenticateToken, async (req, res) => {
  const paramRoom = req.params.room;
  const userName = req.user.username;
  const userid = req.user._id;
  const roomExist = await Room.findOne({ name: paramRoom })
  const userJoin = await Room.findOne({ $and: [ { users: { $elemMatch: {username: userName}} }, { name: paramRoom } ]})
  if (roomExist) {
    if (!userJoin) {
      await Room.updateOne({ users: { $elemMatch: {username: userName}} }, {
        $pull: {
          users: { username: userName } 
        }
      })
      await Room.updateOne({ name: paramRoom },
        {$push: {users: {
          username: userName,
          UserId: userid,
          socketId: ""
        }}})
    }
    res.render('chatRoom', { 
      roomName: req.params.room, 
      username: userName,
      name: req.user.username,
      title: 'chatroom'
    })
  } else {
    // room doesn't exit
    return res.redirect('/chat')
  }
})

module.exports = router;