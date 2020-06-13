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

// <% if ( %> <%= messages.profilepic %> <% ) { %>
//   <img src="uploads/profile/" + <%= messages.profilepic %> + "" alt="profile-pic">
//   <% } else { %>
//     <img src="uploads/profile/default-user.png" alt="profile-pic">
//   <% } %>


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

    // todo search if file name exist in database else do nothing
    uploadProfilePic(req, bucket, db)
  } catch (error) {
    console.error(error);
  }
}

const uploadProfilePic = (req, bucket, db) => {
  if (req.files.profilepic) {
    if (req.files.profilepic.type === 'image/jpeg' || req.files.profilepic.type === 'image/png' || req.files.profilepic.type === 'image/jpg') {
      console.log('path: ' + req.files.profilepic.name)
      console.log('ext: ' + req.files.profilepic.type)
      fs.createReadStream(req.files.profilepic.path).
      pipe(bucket.openUploadStream(req.user._id + path.extname(req.files.profilepic.name))).
      on('error', function(error) {
        assert.ifError(error);
      }).
      on('finish', async () => {
        console.log('done!');
        const checkPictureExist = await db.collection('profile_pics.files').findOne({ filename: { $regex: "(" + req.user._id + ")\..*" } });
        if (checkPictureExist) {
          const filenamePic = checkPictureExist.filename;
          await downloadProfilePic(req, bucket, filenamePic)
        }
        // process.exit(0);
      });
      return;
    }
    return;
  }
  console.log("not an image or it's bigger than 10mb");
  
  return req.flash('profile', 'Not an image') // todo in fron-end
}

const downloadProfilePic = async (req, bucket, filenamePic) => {
  let filenamePath = '';
  const regExp = /profile\..*/
  const directoryPath = path.join(__dirname, '../../public/uploads/profile');
  fs.readdir(directoryPath, (err, files) => {
    if (err) return console.log('Unable to scan directory: ' + err)
    
    files.forEach(file => {
      if (file.match(regExp)) {
        filenamePath = file
        console.log(filenamePath);
        const pathToOldProfilePicPath = 'public/uploads/profile/' + filenamePath + '';
        fs.unlink(pathToOldProfilePicPath, function(err) {
          if (err) {
            // console.error(err)
          } else {
            console.log("successfully deleted the file.");
            
          }
        })
      }
    })
  })
  bucket.openDownloadStreamByName(filenamePic).
  pipe(fs.createWriteStream(`public/uploads/profile/profile${path.extname(filenamePic)}`)).
  on('error', function(error) {
    assert.ifError(error);
  }).
  on('finish', function() {
    console.log('done!');
  });
}

router.get('/', authenticateToken, (req, res) => {
  res.render('account/editProfile.ejs', {
    name: req.user.username,
    title: 'profile'
  })
});

router.post('/upload', authenticateToken, formparser, (req, res) => {
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