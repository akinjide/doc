// get packages
var express         = require('express'),
    router          = express.Router(),

    // get mongoose user model
    userController  = require('../controllers/user.controller'),

    // get token verifier 
    verifyToken = require('../config/verify');

/** [exports defines all route and middleware] */
module.exports = function(router) {
  
   /**
    * register a new user 
    * accessed at POST /api/users
    */
  router.route('/users')
    .post(userController.createUser);

  /**
   * login a user and generatess a token
   * accessed at POST /api/users/login
   */
  router.route('/users/login')
    .post(userController.login);

  /**
   * middleware verify user token before below routes
   * can be accessed
   */
  router.use(verifyToken.verify);

  /**
   * 
   */
  router.route('/users/logout')
    .post(userController.logout);

  /**
   * retrieves all users 
   * accessed at GET /api/users
   */
  router.route('/users')
    .get(userController.getUsers);

  /**
   * user by id 
   * accessed at GET /api/users/:id
   * accessed at PUT /api/users/:id
   * accessed at DELETE /api/users/:id
   */
  router.route('/users/:id')
    .get(userController.getUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

  /**
   * retrieve a user documents
   * accessed at GET /api/users/:id/documents
   */
  router.route('/users/:id/documents')
    .get(userController.getUserDocument);
};