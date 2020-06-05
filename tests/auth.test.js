const { createJsonWebToken, authenticateToken, checkAuthenticateToken, signInGoogle } = require('../config/jwtToken');

// unit tests

test('should create a jwt Token for the user', () => {
  const userTest = createJsonWebToken('1234', 'userTest', )
})


// intergration tests





// E2E tests