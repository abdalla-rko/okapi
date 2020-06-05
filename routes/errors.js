const express = require('express');
const router = express.Router();

router.get('*', function(req, res){
  // res.status(404).send('this page doesn\'t exits!');
  res.render('errors/404error.ejs', {
    title: '404 error'
  })
});

module.exports = router;