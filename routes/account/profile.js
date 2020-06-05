const express = require('express');
const authenticateToken = require('../../config/jwtToken').authenticateToken;
const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  res.render('account/profile.ejs', {
    name: req.user.username,
    title: 'profile'
  })
});

router.post('/logout', (req, res) => {
  res.cookie('Authorization', {maxAge: Date.now()})
  res.redirect('/auth');
});

module.exports = router;