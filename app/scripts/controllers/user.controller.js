(function() { 
/**
*  @module [myApp]
*/
angular.module('myApp')
  /**
   * [userController]
   * @param     {[module]}    $scope      [Angular $scope for viewModel]
   * @param     {[module]}    $log        [logger: .log(), .info(), .error()]
   * @param     {[module]}    UserService [service for $http request]
   * @param     {[module]}    $state      [Route state]
   * @param     {[module]}    $cookies    [save information into user browser]
   * @param     {[module]}    $mdToast)   [displays results]
   */
  .controller('userController', [
    '$scope', 
    '$log',
    'UserService', 
    '$state', 
    '$cookies', 
    '$mdToast',
    function($scope, $log, UserService, $state, $cookies, $mdToast){

      function check () {
        var user = $cookies.get('uID');
        return user ? true : false;
      }

      var userID = $cookies.get('uID');
      $log.log(userID);

      function setExpire(exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        return d.toGMTString();
      };

      function toastrAction(content) {
        $mdToast.show(
          $mdToast.simple()
            .content(content)
            .action('OK')
            .position('top right')
        );
      };

      function toastr(content, time) {
        $mdToast.show(
          $mdToast.simple()
            .content(content)
            .position('top right')
            .hideDelay(3000)
        );
      };

      UserService
        .getUser(userID)
        .then(function(response) {
          var getUserResponse = response.data;
          $scope.vm = getUserResponse['response'];
        });

      $scope.login = function(param) {
        UserService
          .userLogin(param)
          .then(function(response) {
            var data = response.data;

            if (data.statusCode === 200) {
              var userDetails = data['response'];

              $log.log(data);
              $cookies.put('uT', userDetails.token, { expires : setExpire(1) });
              $cookies.put('uID', userDetails.user['_id'], { expires : setExpire(1) });

              toastr(data.statusMessage);
              $state.go('documents');
            }
            else if (data.statusCode === 400 ) {
              if (data.statusCode === 400 && data.statusMessage === 'Already logged in') {
                $state.go('profile');
                toastr(data.statusMessage);
              }
              else {
                toastr(data.statusMessage);
              }
            }
            else if (data.statusCode === 500) {
              $log.log(data);
              toastr(data.statusMessage);
            } 
          });
      };

      $scope.createUser = function(params) {
        UserService
          .createUser(params)
          .then(function(response) {
            var data = response.data;
            $log.log(data);
            
            if (data.statusCode === 201) {
              $state.reload();
              toastrAction(data.statusMessage + ', Please sign in, to continue');
            }
            else if (data.statusCode === 400) {
              toastr(data.statusMessage);
            }
            else if (data.statusCode === 403) {
              toastr(data.statusMessage);
            }
            else if (data.statusCode === 409) {
              toastr(data.statusMessage);
            }
          });
      };

      if (!check()) {
        $state.go('home')
      }
      else {
        $scope.logout = function() {
          UserService
            .userLogout()
            .then(function(response) {
              var data = response.data;

              if (data.statusCode === 200) {
                toastr(data.statusMessage);
                $cookies.remove('uID');
                $cookies.remove('uT');
                $cookies.remove('dID');
                $cookies.remove('session');
                $state.go('home');
                $log.log($cookies.get('session'));
              }
              else if (data.statusCode === 401) {
                toastr(data.statusMessage);
                $log.log(data);
              }
              else if (data.statusCode === 500) {
                toastr(data.statusMessage);
                $log.log(data);
              }
            });
        };
        
        $scope.updateUser = function(params) {
          var userID = $cookies.get('uID');

          swal({   
            title: "Are you sure?",   
            text: "You will not be able to recover previous details!",   
            type: "warning",   
            showCancelButton: true,   
            confirmButtonColor: "#90BAE8",   
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "No, cancel!",   
            closeOnConfirm: false,
            closeOnCancel: false 
          }, function(isConfirm) {  
            if (isConfirm) { 
              UserService
                .updateUser(userID, params)
                .then(function(response) {
                  var data = response.data;

                  if (data.statusCode === 200) {
                    $state.go('profile');
                  }
                  else if (data.statusCode === 500) {
                    toastr(data.statusMessage);
                  }
                });
              swal("Updated!", "Your profile has been updated.", "success"); 
            } 
            else {
              $state.reload();
              swal("Cancelled", "Your profile is safe :)", "error"); 
            }
          });
        };

        $scope.deleteUser = function(id) {
          $log.log(id);
          swal({   
            title: "Are you sure?",   
            text: "You will not be able to recover this profile, please read the T&A below!",   
            type: "warning",   
            showCancelButton: true,   
            confirmButtonColor: "#F58080",   
            confirmButtonText: "Yes, delete it!",   
            cancelButtonText: "No, cancel!",   
            closeOnConfirm: false,   
            closeOnCancel: false 
          }, function(isConfirm){   
            if (isConfirm) {     
              UserService
                .deleteUser(id)
                .then(function(response) {
                  var data = response.data;

                  if (data.statusCode === 200) {
                    $cookies.remove('uID');
                    $cookies.remove('uT');
                    $cookies.remove('dID');
                    $state.go('home');
                  }
                  else if (data.statusCode === 500) {
                    toastr(data.statusMessage);
                  }
                });
              swal("Deleted!", "Your profile has been deleted, Really sad you leaving", "success");   
            } 
            else {     
              swal("Cancelled", "Your profile is safe :)", "error");   
            } 
          });
        };

        UserService
          .getUserDocuments(userID)
          .then(function(response) {
            var data = response.data;

            if (data.statusCode === 200) {
              $scope.userDocuments = data['response'];
            }
            else if (data.statusCode === 500) {
              toastr(data.statusMessage);
            }
            else if (data.statusCode === 204) {
              //toastrAction(data.statusMessage)
            }
          });
      }
  }]);
})();