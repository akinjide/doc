// Get mongoose user model and config file
var User = require('../models/user.model'),
    config = require('./config'),

    // Use to create, sign and verify tokens
    jwt = require('jsonwebtoken');

/** @type {Object} [exports verify method] */
module.exports = {
  /**
   * [verify   compare provided token secret with the issuer secret and
   *           checks the expireDate
   *           ]
   * @param     {[object]}    req 
   * @param     {[object]}    res 
   * @param     {Function}    next
   * @return    {[object]}
   */
  verify : function(req, res, next) {
    // check header, url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
      // verifies secret and checks expireDate
      jwt.verify(token, config.secret, { algorithms: ['HS256'] }, function(err, decoded) {
        if (err) {
          return res.json({ statusCode : 498, status : 'Token expired/invalid', message : 'failed to authenticate token', response : err });
        }
        else {
          if (req.session && req.session.userID) {
            // save to request for use in other routes if everything is good
            req.decoded = decoded;
            next();
          } 
          else {
            return res.json({ statusCode : 401, status : 'Unauthorized', statusMessage : 'Not logged in, please login' });
          }
        }
      });
    }
    else {
      // if there is no token, return error
      return res.json({ statusCode : 499, status : 'Token required', message : 'not authorized, please login' });
    }
  }
};