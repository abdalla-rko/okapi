const express = require('express');
const {authenticateToken} = require('../config/jwtToken');
const { addFriend, acceptOrRefuseRequest } = require('../handlers/friend')
const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  
});

router.post('/add', authenticateToken, (req, res) => {
})

module.exports = router;