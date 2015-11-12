// get mongoose user and Document model and config file
var User     = require('../models/user.model'),
    config   = require('../config/config'),
    Document = require('../models/document.model'),

    // load JWT module
    jwt      = require('jsonwebtoken'); 

/** @type {Object} [exports methods to be used by specific routes] */
module.exports = {

  /**
   * [createUser checks if user field is accurate,
   *             find a user by username,
   *             save it along with request]
   * @param     {[JSON]}       req 
   * @param     {[JSON]}       res 
   * @param     {Function}     next
   * @return    {[JSON]}           
   */
  createUser : function(req, res, next) {
    if (!( req.body.email || req.body.password || req.body.username )) {
      res.json({ statusCode : 400, status : 'Bad Request', statusMessage : 'please fill all fields' });
    }
    else {
      User.findOne({ username : req.body.username }, function(err, response) {
        if (err)
          return res.json({ statusCode : 500, status : 'Internal Server Error', statusMessage: 'an error occured, please check and try again', response : err });

        if (response) {
          return res.json({ statusCode : 403, status : 'Forbidden', statusMessage : 'user already exist, please login', response : response });
        }
        else {
          var saveUser = req.body,
              user = new User(saveUser);

          user.save(function(err, response) {
            if (err) {
              return res.json({ statusCode : 409, statusMessage : 'please check all fields, including password field', status : 'Conflict', response : err });
            }
            else {
              return res.json({ statusCode : 201, status : 'Created', statusMessage : 'user save successful', response : response });
            }
          });
        }
      });
    };
  },

  /**
   * [login find a user by username,
   *        validate user entered password,
   *        generate and assign token to user,
   *        return success if all is passed]
   * @param     {[JSON]}    req
   * @param     {[JSON]}    res
   * @return    {[JSON]}       
   */
  login : function(req, res) {
    if(!req.session.userID) {
      User.findOne({ username : req.body.username }, function(err, user) {
        if (err)
          return res.json({ statusCode : 500, status : 'Internal Server Error', statusMessage: 'an error occured, please try again', response : err });

        if(!user) {
          return res.json({ statusCode : 400, status : 'Bad Request', statusMessage : 'sign in failed, user not found' });
        }
        else if (user) {
          var validatePassword = user.comparePassword(req.body.password);
          if (!(validatePassword)) {
            return res.json({ statusCode : 400, status : 'Bad Request', statusMessage : 'sign in failed, incorrect password' });
          }
          else {
            var d = new Date();
                sec = 43200,
                expire = d.setTime(d.getTime() + (12*60*60)),
                payload = {
                  issuer : 'Akinjide',
                  subject : 'User Token',
                  audience : user,
                  expiresIn : sec,
                  nbf : expire,
                  iat : Date.now()
                },
                token = jwt.sign(payload, config.secret);
            // Set-cookie: userID=<blah>
            req.session.userID = user.id;
            return res.json({ statusCode : 200, status : 'OK', statusMessage : 'login successful', response : { user, token, expires : new Date(expire) } });
          }
        }
      });
    }
    else {
      return res.json({ statusCode : 400, status : 'Bad Request', statusMessage : 'Already logged in' });
    }
  },

  /**
   * [logout logs out the user by destroying the session]
   * @param     {[JSON]}     req
   * @param     {[JSON]}     res
   * @return    {[JSON]}        
   */
  logout : function(req, res) {
    req.session.destroy(function(err, response) {
      if (err) {
        return res.json({ statusCode : 500, status : 'Internal Server Error', statusMessage: 'an error occured, please try again', response : err });
      }
      else {
        return res.json({ statusCode : 200, status : 'OK', statusMessage : 'logout successful', response : response });
      }
    })
  },

  /**
   * [getUsers fetch all users from the database]
   * @param     {[JSON]}     req
   * @param     {[JSON]}     res
   * @return    {[JSON]}        
   */
  getUsers : function(req, res) {
    User.find({}, function(err, response) {
      if (err) {
        return res.json({ statusCode : 500, status : 'Internal Server Error', statusMessage: 'an error occured, please try again', response : err });
      }
      else {
        return res.json({ statusCode : 200, status : 'OK', response : response });
      }
    });
  },

  /**
   * [getUser find a user by ID,
   *           return user with that ID]
   * @param     {[JSON]}     req
   * @param     {[JSON]}     res
   * @return    {[JSON]}        
   */
  getUser : function(req, res) {
    var query = { _id : req.params.id };

    User.findById(query, function(err, response) {
      if (err) {
        return res.json({ statusCode : 500, status : 'Internal Server Error', statusMessage: 'an error occured, please check and try again', response : err });
      }
      else {
        if ((response)) {
          return res.json({ statusCode : 200, status : 'OK', response : response });
        }
        else {
          return res.json({ statusCode : 410, status : 'Gone', statusMessage : 'user does not exist', response : response });
        }
      }
    })
  },

  /**
   * [updateUser   find a user by ID,
   *               update user with that ID]
   * @param     {[JSON]}       req
   * @param     {[JSON]}       res
   * @return    {[JSON]}          
   */
  updateUser : function(req, res) {
    var query = { _id : req.params.id };

    User.update(query, req.body, function(err, response) {
      if (err) {
        return res.json({ statusCode : 500, status : 'Internal Server Error', statusMessage : 'an error occured, user update failed', response : err });
      }
      else {
        return res.json({ statusCode : 200, status : 'OK', statusMessage : 'user update successful', response : response });
      }
    });
  },

  /**
   * [deleteUser   find a user by ID,
   *               delete the user with that ID]
   * @param     {[JSON]}      req
   * @param     {[JSON]}      res
   * @return    {[JSON]}         
   */
  deleteUser : function(req, res) {
    var query = { _id : req.params.id };

    User.remove(query, function(err, response) {
      if (err) {
        return res.json({ statusCode : 500, status : 'Internal Server Error', statusMessage : 'an error occured, user delete failed', response : err });
      }
      else {
        return res.json({ statusCode : 200, status : 'OK', statusMessage : 'user delete successful', response : response });
      }
    })
  },

  /**
   * [getUserDocument find user by ID,
   *                  populate the _ownerId field with user Info,
   *                  execute callback]
   * @param     {[JSON]}       req
   * @param     {[JSON]}       res
   * @return    {[JSON]}          
   */
  getUserDocument : function(req, res) {
    var query = { _ownerId : req.params.id };

    Document.find(query)
      .populate('_ownerId')
      .exec(function(err, response) {
        if (err) {
          return res.json({ statusCode : 500, status : 'Internal Server Error', statusMessage: 'an error occured while getting user documents, please try again', response : err });
        }
        else {
          if ((response.length == 0)) {
            return res.json({ statusCode : 204, status : 'No Content', statusMessage : 'no document found', response : response });
          }
          else {
            return res.json({ statusCode : 200, statusMessage : 'OK', response : response });
          }
        }
      }); 
  }
};