const express = require('express');
const authenticateToken = require('../../config/jwtToken').authenticateToken;
const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  res.render('profile.ejs', {
    name: req.user.username,
    title: 'profile'
  })
});

router.post('/logout', (req, res) => {
  res.cookie('Authorization', {maxAge: Date.now()})
  res.redirect('/auth');
});

// todo verify reset token
router.post('/verifyResetToken', (req, res) => {
  // Check if user exists and token is valid 
  const user = await user.findOne({
    email,
    passwordResetToken: authenticateToken,
    passwordResetTokenExpiry: {
      $gte: Date.now() - RESET_PASSWORD_TOKEN_EXPIRY
    }
  });
  if (!user) {
    throw new Error('this token is either invalid or expired');
  }

  return { message: 'Succes' };
})

// todo request passward rest
router.post('/requestResetPassword', (req, res) => {
  const userEmail = 'user email';
  // check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error(`No such user found for email ${email}.`);
  }

  // Set password reset token and it's expiry
  const token = generateToken(user, process.env.SECRET, RESET_PASSWORD_TOKEN_EXPIRY);
  await User.findOneAndUpdate(
    { _id: user.id },
    { passwordResetToken: token, passwordResetTokenExpiry: tokenExpiry },
    { new: true }
  );

  // Email user rest link
  const resetLink = `${process.env.FRONTENT_URL}/reset-password?email=${email}&token=${token}`;
  const mailOptions = {
    to: email,
    subject: 'Password Reset',
    html: resetLink
  };

  await sendEmail(mailOptions)

  //return success message
  return {
    message: `A link to reset your password has been sent to ${email}`
  };
})

// todo reset password
router.post('/resetPassword', (req, res) => {
  if (!password) {
    throw new Error('Enter password and Confirm password.');
  }

  if (password.length < 6) { 
    throw new Error('Password min 6 characters')
  }

  // check if user exists and token is valid
  const user = await User.findOne({
    email,
    passwordResetToken: token,
    passwordResetTokenExpiry: {
      $gte: Date.now() - RESET_PASSWORD_TOKEN_EXPIRY
    }
  });
  if (!user) {
    throw new Error('this token is either invalid or expired!');
  }

  // Update Password, reset token and it's expiry 
  user.passwordResetToken = '';
  user.passwordResetTokenExpiry = '';
  user.password = password;
  await user.save();

  // return success message
  return {
    token: generateToken(user, process.env.SECRET, AUTH_TOKEN_EXPIRY)
  }
})

module.exports = router;