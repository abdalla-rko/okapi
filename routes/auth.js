const router = require('express').Router();
const {createJsonWebToken, checkAuthenticateToken} = require('../config/jwtToken');
const { loginUser, registerUser } = require('../config/authConfig');
const {OAuth2Client} = require('google-auth-library');
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/', checkAuthenticateToken, (req, res) => {
  res.render('signin.ejs', {
    title: 'signin'
  });

});

router.post('/', checkAuthenticateToken, async (req, res) => {
    const {email, password} = req.body
    const emailSave = email.toLowerCase();
    const errorMessage = await loginUser(emailSave, password, res);
    if (typeof errorMessage === 'string') {
      req.flash('auth', errorMessage)
      res.redirect('/auth')
    }
  }
);

router.get('/signup', checkAuthenticateToken, (req, res) => {
  res.render('register.ejs', {
    title: 'signup'
  });
});

// todo: direct signin when register
router.post('/signup', checkAuthenticateToken, async (req, res) => {
  const {
    username,
    email,
    password
  } = req.body;

  const usernameSave = username.toLowerCase();
  const emailSave = email.toLowerCase();

  const errorMessage = await registerUser(usernameSave, emailSave, password, res);
  if (typeof errorMessage === 'string') {
    req.flash('auth', errorMessage)
    res.redirect('/auth/signup')
  }
});


router.post('/google', (req, res) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: req.body.idtoken,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
    });
    const payload = ticket.getPayload();
    const userIdPass = payload['sub'];
    const userName = payload['name'];
    const userEmail = payload['email'];
     //todo: handle the error with a better way
    const usernameSave = userName.toLowerCase();
    const emailSave = userEmail.toLowerCase();

      // todo: better error handeling
    const emailExist = await User.findOne({email: emailSave});
    if (emailExist) return await createJsonWebToken(emailSave, res)

    const saltRounds = 10;

    bcrypt.hash(userIdPass, saltRounds, async function (err, hash) {
      const user = new User({
        username: usernameSave,
        email: emailSave,
        password: hash
      });

      try {
        await user.save();
        await createJsonWebToken(user.email, res)
      } catch (err) {
        console.error('error **', error)
      }
    });
  }
  verify().catch(console.error);
});

router.post('/facebook', async (req, res) => {
  console.log('*****a', req.body);
  // todo verify token
  const { name, email, id } = req.body;

  const usernameSave = name.toLowerCase();
  const emailSave = email.toLowerCase();


  // todo: better error handeling
  const emailExist = await User.findOne({email: emailSave});
  if (emailExist) return await createJsonWebToken(emailSave, res)
  const usernameExist = await User.findOne({username: usernameSave})
  if (usernameExist) return await createJsonWebToken(emailSave, res)

  const user = new User({
    username: usernameSave,
    email: emailSave
  })
  try {
    await user.save()
    await createJsonWebToken(user.email, res)
  } catch (err) {
    console.error('error', error)
  }
  
})

module.exports = router;