/**
*  @module [UserService]
*
*  @description [service: return response for HTTP Request]
*/
angular.module('myApp')
  .value('userAPI', '/api/users')
  .factory('UserService', ['$http', '$log', 'userAPI', function($http, $log, userAPI) {
    return {
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

      userLogin : function(param) {
        return $http.post(userAPI + '/login', { username : param.username, password : param.password });
      },

      userLogout : function() {
        return $http.post(userAPI + '/logout');
      },

      getUsers : function() {
        return $http.get(userAPI);
      },

      getUser : function(userID) {
        return $http.get(userAPI + '/' + userID);
      },

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

      deleteUser : function(userID) {
        return $http.delete(userAPI + '/' + userID);
      },

      getUserDocuments : function(userID) {
        return $http.get(userAPI + '/' + userID + '/documents');
      },
    };
  }]);