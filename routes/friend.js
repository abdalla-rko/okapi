express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Friend = require('../models/Friend');
const {authenticateToken} = require('../config/jwtToken');
const { addFriend, acceptOrRefuseRequest } = require('../handlers/friend')
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user._id;
  const users = await User.find({ $and: [{ isOnline: true }, { _id: { $ne: userId } }] }, { username: 1, friends: 1 }).limit(10)
  .populate({
    path: "friends",
    model: "Friend"
  })
  .exec((err, users) => {
    const addFriendListArray = []
    console.log(users);
    
    if (users) {
      users.forEach(user => addFriendListArray.push(user))
    }
    res.render('friend/addFriendList.ejs', {
      name: req.user.username,
      title: 'Add List',
      addFriendList: addFriendListArray
    })
  })
});

router.post('/add', authenticateToken, async (req, res) => {
  const requestExist = await Friend.findOne({ friendRequest: req.body.userid })
  if (!requestExist) {
    const friend = await new Friend({
      user: req.user._id,
      friendRequest: req.body.userid
    })
    try {
      await friend.save()
    } catch (error) {
      console.error(error)
    }
  }
})

router.post('/accept', authenticateToken, async (req, res) => {
  
})

router.post('/refuse', authenticateToken, async (req, res) => { 
})

module.exports = router;