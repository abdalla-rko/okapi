// todo seperate jwt from other files and import it from here
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const cookie = require('cookie');

async function createJsonWebToken(email, res) {
  const userData = await User.findOne({email: email}, {_id: 1, username: 1})
  const userId = userData._id;
  await User.updateOne({ _id: userId }, {
    $set: { isOnline: true }
  })
  const username = userData.username;
  const token = jwt.sign({_id: userId, username: username}, process.env.TOKEN_SECRET);
  const refreshToken = jwt.sign({_id: userId, username: username}, process.env.REFRESH_TOKEN_SECRET);
    await User.updateOne({_id: userId}, {
      refresh_token: refreshToken
    })
    const setCookie = cookie.serialize('Authorization', 'Bearer ' + token, {
      maxAge: 60 * 40,
      path: '/'
    })
    res.setHeader('Set-Cookie', setCookie);
    res.redirect('/');
}

// todo better error handling
function refreshAndCheckToken(req, res, next, authenticate) {
  if (req.headers.cookie){
    const parseHeader = cookie.parse(req.headers.cookie)
    if (parseHeader.Authorization) {
      const authHeader = parseHeader.Authorization.split(' ')[1];
      jwt.verify(authHeader, process.env.TOKEN_SECRET, async (err, user) => {
        if (err) {
          if (authenticate === '/auth') return res.redirect(authenticate)
          return next()
        }
        req.user = user
        const refreshToken = await User.findOne({_id: user._id}, {_id: 0, refresh_token: 1})
        if (!refreshToken) return res.redirect('/auth')
        jwt.verify(refreshToken.refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
          if (err) return res.res.redirect('/auth')
          const accessToken = jwt.sign({_id: user._id, username: user.username}, process.env.TOKEN_SECRET);
          
          const setCookie = cookie.serialize('Authorization', 'Bearer ' + accessToken, {
            maxAge: 60 * 40,
            path: '/'
          })
          res.cookie('Authorization', authHeader, {maxAge: Date.now()})
          res.setHeader('Set-Cookie', setCookie)
          if (authenticate === '/') return res.redirect(authenticate)
          next()
        })
      })
    } else {
      if (authenticate === '/auth') return res.redirect(authenticate)
      next()
    }
  } else {
    if (authenticate === '/auth') return res.redirect(authenticate)
    next()
  }
}

function checkAuthenticateToken (req, res, next) {
  const userIsAuthenticated = '/';
  refreshAndCheckToken(req, res, next, userIsAuthenticated)
}

function authenticateToken(req, res, next) {
  const userNotAuthenticated = '/auth';
  refreshAndCheckToken(req, res, next, userNotAuthenticated)
}

module.exports = {
  createJsonWebToken,
  authenticateToken,
  checkAuthenticateToken
}
