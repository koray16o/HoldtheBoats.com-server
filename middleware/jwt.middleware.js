const { expressjwt: jwt } = require('express-jwt');

//Instantiate the jwt token validation middleware
const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'payload', //we will access the decoded jwt in req.payload
  getToken: getTokenFromHeaders //Function to extract the jwt
});

//The function passed in the getToken property above

function getTokenFromHeaders(req) {
  //Checks if the Token is on the request headers and has the following format:
  /* const request = {
        headers: {
            authorization : "Bearer sjjsjsjs"
        }
    } */
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    const token = req.headers.authorization.split(' ')[1];
    return token;
  }
  return null;
}

//Export the middleware to use it in protected routes
module.exports = { isAuthenticated };
