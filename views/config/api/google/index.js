const {OAuth2Client} = require('google-auth-library');
const {google} = require('googleapis');
const User = require('../../../models/User');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({path: '../../../.env'});
}


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
}
verify().catch(console.error);

