/**
*  @module [UserService]
*
*  @description [service: return response for HTTP Request]
*/
angular.module('myApp')
  .value('userAPI', '/api/users')
  .factory('UserService', ['$http', '$log', 'userAPI', function($http, $log, userAPI) {
    return {
      
      /**
       * [createUser POST creates a user]
       * @param     {[Object]}     params [contains user details to create]
       * @return    {[Object]}            [a promise from API]
       */
      createUser : function(params) {
        return $http.post(userAPI, { 
                                    username   : params.username, 
                                    name       : {
                                                  first : params.first, 
                                                  last  : params.last
                                                  },
                                    email      : params.email, 
                                    password   : params.password 
                                  });
      },

      /**
       * [userLogin POST logs in a user]
       * @param     {[Object]}       param [contains user details to login]
       * @return    {[Object]}             [a promise from API]
       */
      userLogin : function(param) {
        return $http.post(userAPI + '/login', { username : param.username, password : param.password });
      },

      /**
       * [userLogout POST logs out a user]
       * @return    {[Object]}         [a promise from API]
       */
      userLogout : function() {
        return $http.post(userAPI + '/logout');
      },

      /**
       * [getUsers GET all users]
       * @return    {[Object]}      [a promise from API]
       */
      getUsers : function() {
        return $http.get(userAPI);
      },

      /**
       * [getUser GET a user details]
       * @param     {[String]}    userID [contains the logged in userID]
       * @return    {[Object]}           [a promise from API]
       */
      getUser : function(userID) {
        return $http.get(userAPI + '/' + userID);
      },

      /**
       * [updateUser PUT a user]
       * @param     {[String]}    userID [contains the logged in userID]
       * @param     {[Object]}    params [contains user details to update]
       * @return    {[Object]}           [a promise from API]
       */
      updateUser : function(userID, params) {
        return $http.put(userAPI + '/' + userID, { 
                                            username   : params.username, 
                                            name       : {
                                                          first : params.name.first, 
                                                          last  : params.name.last
                                                          },
                                            email      : params.email, 
                                          });
      },

      /**
       * [deleteUser DELETE a user]
       * @param     {[String]}      userID [contains the logged in userID]
       * @return    {[Object]}             [a promise from API]
       */
      deleteUser : function(userID) {
        return $http.delete(userAPI + '/' + userID);
      },

      /**
       * [getUserDocuments GET a user documents]
       * @param     {[String]}     userID [contains the logged in userID]
       * @return    {[Object]}            [a promise from API]
       */
      getUserDocuments : function(userID) {
        return $http.get(userAPI + '/' + userID + '/documents');
      },
    };
  }]);