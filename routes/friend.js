const express = require('express');
const User = require('../models/User');
const {authenticateToken} = require('../config/jwtToken');
const { addFriend, acceptOrRefuseRequest } = require('../handlers/friend')
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user._id;
  const users = await User.find({ $and: [{ isOnline: true }, { _id: { $ne: userId } }] }, { username: 1 }).limit(10).exec((err, users) => {
    const addFriendListArray = []
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

router.post('/add', authenticateToken, (req, res) => {
})

module.exports = router;