const express = require('express');
const authenticateToken = require('../config/jwtToken').authenticateToken;
const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  res.render('feedback.ejs', {
    name: req.user.username,
    title: 'about'
  })
});

module.exports = router;