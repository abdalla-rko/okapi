const express = require('express');
const {authenticateToken} = require('../../config/jwtToken');
const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  req.flash('info', 'welcome');
  res.render('index.ejs', {
    name: req.user.username,
    title: 'home'
  })
});

router.post('/logout', (req, res) => {
  res.cookie('Authorization', {maxAge: Date.now()})
  res.redirect('/auth');
});

module.exports = router;