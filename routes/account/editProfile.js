const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const { Formidable } = require('formidable');
const mongodb = require('mongodb');
const assert = require('assert');
const fs = require('fs');
const authenticateToken = require('../../config/jwtToken').authenticateToken;
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({path: '../../.env'});
}

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

const connectDatabase = async (req, res) => {
  try {
    const client = await new mongodb.MongoClient(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useNewUrlParser: true
    });

    await client.connect()

    const db = await client.db();
    const bucket = await new mongodb.GridFSBucket(db, {
      bucketName: 'profile_pics'
    });

    // req.files.profilepic.name ? await uploadProfilePic(req, res, bucket) : null;
    // todo search if file name exist in database else do nothing
    // await await uploadProfilePic(req, res, bucket)

    const checkPictureExist = await db.collection('profile_pics.files').findOne({ filename: "download.jpeg" });
    if (checkPictureExist) {
      await downloadProfilePic(req, res, bucket)
    }
  } catch (error) {
    console.error(error);
  }
}

const uploadProfilePic = (req, res, bucket) => {
  if (req.files.profilepic) {
    if (req.files.profilepic.type === 'image/jpeg' || req.files.profilepic.type === 'image/png' || req.files.profilepic.type === 'image/jpg') {
      console.log('path: ' + req.files.profilepic.name)
      console.log('ext: ' + req.files.profilepic.type)
      fs.createReadStream(req.files.profilepic.path).
      pipe(bucket.openUploadStream("profile" + path.extname(req.files.profilepic.name))).
      on('error', function(error) {
        assert.ifError(error);
      }).
      on('finish', function() {
        console.log('done!');
        return;
        // process.exit(0);
        });
    }
  }
  console.log("not image or image is bigger than 10mb");
  
  return req.flash('profile', 'Not an image') // todo in fron-end
}

const downloadProfilePic = (req, res, bucket) => {
  // find user profile
  // bucket.findOne({})
  // Use bucket...


  const pathToOldProfilePic = 'public/uploads/profile/profile.jpeg';
  fs.unlink(pathToOldProfilePic, function(err) {
    if (err) {
      // console.error(err)
    } else {
      console.log("successfully deleted the file.");
      
    }
  })


  bucket.openDownloadStreamByName("haha.jpeg").
  pipe(fs.createWriteStream(`public/uploads/profile/profile.jpeg`)).
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
  const form = new Formidable({ maxFileSize: 10 * 1024 * 1024 });
  form.parse(req, function (err, fields, files) {
    req.files = files;
    next();
  });
}

module.exports = router;