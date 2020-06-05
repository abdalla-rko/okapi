const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const formidable = require('formidable');
const mongodb = require('mongodb');
const assert = require('assert');
const fs = require('fs');
const authenticateToken = require('../../config/jwtToken').authenticateToken;
const router = express.Router();


// * set storage Engine multer
// * multer is used to sasve files in file disk
// const storage = multer.diskStorage({
//   destination: './public/uploads/',
//   filename: function(req, file, cb){
  //     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  //   }
  // // })
  // const storage = multer.memoryStorage();
// console.log("storage ********     ", storage);


// // init Upload
// var upload = multer({ storage: storage }).single('profilepic')
// const upload = multer({
  //// storage: storage,
  //   limits: {
    //     fileSize: 5000000
    //   },
    //   fileFilter: function(req, file, cb){
//     checkFileType(file, cb);
//   }
// }).single('profilepic');


// ! delete uri
const mongoURI = 'mongodb+srv://appie:Aborko16sd@oncood-js1zu.mongodb.net/oncood?retryWrites=true&w=majority';
const connectDatabase = async (req, res) => {
  try {
    const client = await new mongodb.MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useNewUrlParser: true
    });

    await client.connect()

    const db = await client.db();
    const bucket = await new mongodb.GridFSBucket(db, {
      bucketName: 'profile_pics'
    });

    req.files.profilepic.name ? await uploadProfilePic(req, res, bucket) : null;
    // todo search if file name exist in database else do nothing
    downloadProfilePic(req, res, bucket)
  } catch (error) {
    console.error(error);
  }
}

const uploadProfilePic = (req, res, bucket) => {

  // todo need to save a unique name with user ID
  // crypto.randomBytes(16, (err, buf) => {
  //   if (err) {
  //     return reject(err);
  //   }
  //   const filename = buf.toString('hex') + path.extname(file.originalname);
  //   console.log(filename);
    
  // });
  // Use bucket...
  fs.createReadStream(req.files.profilepic.path).
  pipe(bucket.openUploadStream(req.files.profilepic.name)).
  on('error', function(error) {
    assert.ifError(error);
  }).
  on('finish', function() {
    console.log('done!');
    // process.exit(0);
  });
}

const downloadProfilePic = (req, res, bucket) => {
  // find user profile
  bucket.findOne({})
  // Use bucket...
  bucket.openDownloadStreamByName("download.jpeg").
  pipe(fs.createWriteStream('profile.jpeg')).
  on('error', function(error) {
    assert.ifError(error);
  }).
  on('finish', function() {
    console.log('done!');
  });
}

// Check file type
function checkFileType(file, cb) {
  // Allowd extions
  const filetypes = /jpeg|jpg|png/;
  // check extions
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  //  check mime type
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only!')
  }
}

router.get('/', authenticateToken, (req, res) => {
  res.render('account/editProfile.ejs', {
    name: req.user.username,
    title: 'profile'
  })
});

router.get('/upload', authenticateToken, (req, res) => {
  res.render('account/editProfile.ejs', {
    name: req.user.username,
    title: 'profile'
  })
})

router.post('/upload', authenticateToken, formparser, (req, res) => {
  
  // res.render('account/editProfile.ejs', {
  //   msg: 'File Uploaded!',
  //   file: `uploads/${req.file.filename}`,
  //   name: req.user.username,
  //   title: 'account'
  // }
  connectDatabase(req, res).catch(console.error)
  res.redirect('/');
})

function formparser(req, res , next) {
  const form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    req.files = files;
    next();
  });
}

module.exports = router;