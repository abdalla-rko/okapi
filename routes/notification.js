const express = require('express');
const {authenticateToken} = require('../config/jwtToken');
const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  
});

module.exports = router;