const express = require('express');
const authenticateToken = require('../../config/jwtToken').authenticateToken;
const path = require('path');
const fs = require('fs');
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  const profilePic = await checkUserProfilePic(req, res)
  req.flash('profilepic', profilePic)
  console.log("****** file name", profilePic);
  
  // res.render('account/profile.ejs', {
  //   name: req.user.username,
  //   title: 'profile'
  // })
  console.log("****** file name2", profilePic);
});

router.post('/logout', (req, res) => {
  res.cookie('Authorization', {maxAge: Date.now()})
  res.redirect('/auth');
});

const checkUserProfilePic = (req, res) => {
  let filenamePath = '';
  const regExp = /profile\..*/
  const directoryPath = path.join(__dirname, '../../public/uploads/profile');
  fs.readdir(directoryPath, (err, files) => {
    if (err) return console.log('Unable to scan directory: ' + err)
    files.forEach(file => {
      if (file.match(regExp)) {
        filenamePath = file
        const pathToOldProfilePicPath = 'public/uploads/profile/' + filenamePath + '';
        if (fs.existsSync(pathToOldProfilePicPath)) {
          console.log('file path',filenamePath);
          res.render('account/profile.ejs', {
            name: req.user.username,
            title: 'profile',
            profilePic: filenamePath
          })
          return file;
        }
      }
    })
    if (!files[1]) {
      res.render('account/profile.ejs', {
        name: req.user.username,
        title: 'profile',
        profilePic: ''
      })
    }
  })
}

module.exports = router;