(function() {
/**
*  @module [myApp]
*/
angular.module('myApp')
  /**
   * [docController]
   * @param     {[module]}    $scope      [Angular $scope for viewModel]
   * @param     {[module]}    $log        [logger: .log(), .info(), .error()]
   * @param     {[module]}    DocService  [service for $http request]
   * @param     {[module]}    $state      [Route state]
   * @param     {[module]}    $cookies    [save information into user browser]
   * @param     {[module]}    $mdToast)   [displays results]
   */
  .controller('docController', [
    '$scope', 
    '$log',
    'DocService', 
    '$state', 
    '$cookies', 
    '$mdToast',
    function($scope, $log, DocService, $state, $cookies, $mdToast){

      /** [check checks for user status] */
        var docID = $cookies.get('dID');

        /** [if checks if docID is available in cookies,
          *     if there is it gets the document.] 
          */  
        if (docID) {
          DocService
            .getDocument(docID)
            .then(function(response) {
              var data = response.data;
              $scope.param = data['response'];
            });
        }

        // HELPER FUNCTION
          /** [toastr Displays message to user] */
          function toastr(content) {
            $mdToast.show(
              $mdToast.simple()
                .content(content)
                .position('top right')
                .hideDelay(3000)
            );
          }
        
        /**
         * [createDocument create a document with the data provided]
         * @param     {[Object]}    params [contains the document data]
         */
        $scope.createDocument = function(params) {
          DocService
            .createDocument(params)
            .then(function(response) {
              var data = response.data;

              // Compare response statusCode 
              if (data.statusCode === 201) {
                toastr(data.statusMessage);
                $state.go('documents');
              }
              else if (data.statusCode === 500) {
                toastr(data.statusMessage);
              }
              else if (data.statusCode === 403) {
                toastr(data.statusMessage);
              }
              else if (data.statusCode === 409) {
                toastr('Document with similar title already exist!');
              }
            });
        };

        /** [edit activates document edit document page.] */
        $scope.edit = function(id) {
          $cookies.put('dID', id);
          $state.go('editdocument', {
            dID : id
          });
        };

        /**
         * [updateDocument updates a document with the new data provided.]
         * @param     {[Object]}     params [contains document data]
         */
        $scope.updateDocument = function(param) {
          var docID = $cookies.get('dID');

          // Sweet Alert
          swal({   
            title: "Are you sure?",   
            text: "You will not be able to recover previous document!",   
            type: "warning",   
            showCancelButton: true,   
            confirmButtonColor: "#90BAE8",   
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "No, cancel!",   
            closeOnConfirm: false,
            closeOnCancel: false 
          }, function(isConfirm) {  
            if (isConfirm) {
              DocService
                .updateDocument(docID, param)
                .then(function(response) {
                  var data = response.data;

                  // Compare response statusCode 
                  if (data.statusCode === 200) {
                    $state.go('documents');
                  }
                  else if (data.statusCode === 500) {
                    toastr(data.statusMessage);
                  }
                });
              swal("Updated!", "Your document has been updated.", "success"); 
            }
            else {
              $state.reload();
              swal("Cancelled", "Your document is safe :)", "error"); 
            }
          });
        };

        /**
         * [deleteDocument deletes a document by ID.]
         * @param     {[Object]}     params [contains document ID]
         */
        $scope.deleteDocument = function(id) {

          // Sweet Alert
          swal({   
            title: "Are you sure?",   
            text: "You will not be able to recover this document!",   
            type: "warning",   
            showCancelButton: true,   
            confirmButtonColor: "#F58080",   
            confirmButtonText: "Yes, delete it!",   
            cancelButtonText: "No, cancel!",   
            closeOnConfirm: false,   
            closeOnCancel: false 
          }, function(isConfirm){  
            if (isConfirm) {
              DocService
                .deleteDocument(id)
                .then(function(response) {
                  var data = response.data;

                  // Compare response statusCode 
                  if (data.statusCode === 200) {
                    $cookies.remove('dID');
                    $state.reload();
                  }
                  else if (data.statusCode === 500) {
                    toastr(data.statusMessage);
                  }
                });
              swal("Deleted!", "Your document has been deleted!", "success"); 
            }
            else {
              swal("Cancelled", "Your document is safe :)", "error");  
            }
          });
        };
  }]);
})();
(function() {
/**
 * [Controller]
 * 
 */
 angular.module('myApp')
  .controller('materialController', [
    '$scope', 
    '$timeout', 
    '$mdSidenav', 
    '$log', 
    function($scope, $timeout, $mdSidenav, $log){

     $scope.toggleLeft = buildDelayedToggler('left');
     $scope.isOpenRight = function(){
       return $mdSidenav('right').isOpen();
     };

     /**
      * Supplies a function that will continue to operate until the
      * time is up.
      */
     function debounce(func, wait, context) {
       var timer;
       return function debounced() {
         var context = $scope,
             args = Array.prototype.slice.call(arguments);
         $timeout.cancel(timer);
         timer = $timeout(function() {
           timer = undefined;
           func.apply(context, args);
         }, wait || 10);
       };
     };

     /**
      * Build handler to open/close a SideNav; when animation finishes
      * report completion in console
      */
     function buildDelayedToggler(navID) {
       return debounce(function() {
         $mdSidenav(navID)
           .toggle()
           .then(function () {
             $log.debug("toggle " + navID + " is done");
           });
       }, 200);
     };

     function buildToggler(navID) {
       return function() {
         $mdSidenav(navID)
           .toggle()
           .then(function () {
             $log.debug("toggle " + navID + " is done");
           });
       };
     };
   }])
   .controller('LeftCtrl', [
    '$scope', 
    '$timeout', 
    '$mdSidenav', 
    '$log', 
    function ($scope, $timeout, $mdSidenav, $log) {

     $scope.close = function () {
       $mdSidenav('left').close()
         .then(function () {
           $log.debug("close LEFT is done");
         });
     };
   }]);
})();
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
    function($scope, $log, UserService, $state, $cookies, $mdToast) {

      /** [check checks for user status] */
      // if (!UserService.checkUser()) {
      //   $state.go('home');
      // };

      var userID = $cookies.get('uID');

      //HELPER FUNCTIONS
        /**
         * [setExpire Sets expiring date on every cookies signed]
         * @param   {[number]}   exdays [a cookie maxAge]
         */
        function setExpire(exdays) {
          var d = new Date();
          d.setTime(d.getTime() + (exdays*24*60*60*1000));
          return d.toGMTString();
        }

        /** [toastrAction Displays message to user with an action the user needs to respond to] */
        function toastrAction(content) {
          $mdToast.show(
            $mdToast.simple()
              .content(content)
              .action('OK')
              .position('top right')
          );
        }

        /** [toastr Displays message to user] */
        function toastr(content) {
          $mdToast.show(
            $mdToast.simple()
              .content(content)
              .position('top right')
              .hideDelay(3000)
          );
        }

      /**
       * [login Logs and create a session for the user in 
       *        if the correct Username and Password is provided.
       *        Also saves basic user info to cookie]
       * @param     {[Object]}    param [contains user information]
       */
      $scope.login = function(param) {
        UserService
          .userLogin(param)
          .then(function(response) {
            var data = response.data;
            
            // Compare response statusCode 
            if (data.statusCode === 200) {
              var userDetails = data['response'];

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
                toastr(data.statusMessage + ', are you trying to create an account?');
              }
            }
            else if (data.statusCode === 500) {
              toastr(data.statusMessage);
            } 
          });
      };

      /**
       * [createUser creates a new user with the provided information]
       * @param     {[Object]}        params [contains user information]
       */
      $scope.createUser = function(params) {
        UserService
          .createUser(params)
          .then(function(response) {
            var data = response.data;

            // Compare response statusCode 
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

      /** [if checks if userID is available in cookies,
        *     if there is it gets the user information.] 
        */  
      if (userID) {
        UserService
          .getUser(userID)
          .then(function(response) {
            var getUserResponse = response.data;
            $scope.vm = getUserResponse['response'];
          });
      }

      /** [logout Destroys user session and destroy cookie data] */
      $scope.logout = function() {
        UserService
          .userLogout()
          .then(function(response) {
            var data = response.data;

            // Compare response statusCode 
            if (data.statusCode === 200) {
              toastr(data.statusMessage);
              $cookies.remove('uID');
              $cookies.remove('dID');
              $cookies.remove('session');
              $state.go('home');
            }
            else if (data.statusCode === 401) {
              toastr(data.statusMessage);
            }
            else if (data.statusCode === 500) {
              toastr(data.statusMessage);
            }
          });
      };
      
      /** [edit activates user edit profile page.] */
      $scope.edit = function(id) {
        $state.go('editprofile', {
          userID : id
        });
      };

      /**
       * [updateUser updates a user with the new information provided.]
       * @param     {[Object]}     params [contains user information]
       */
      $scope.updateUser = function(params) {
        var userID = $cookies.get('uID');

        // Sweet Alert
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

                // Compare response statusCode 
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

      /**
       * [deleteUser deletes a user by id and removes all cookie data]
       * @param     {[String]}      id [User ID]
       */
      $scope.deleteUser = function(id) {

        // Sweet Alert
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

                // Compare response statusCode 
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

      /** [if checks if userID is available in cookies,
        *     if there is it gets all the user document.] 
        */  
      if (userID) {
        UserService
          .getUserDocuments(userID)
          .then(function(response) {
            var data = response.data;

            // Compare response statusCode 
            if (data.statusCode === 200) {
              $scope.userDocuments = data['response'];
            }
            else if (data.statusCode === 500) {
              toastr(data.statusMessage);
            }
            else if (data.statusCode === 204) {
              toastr('You don\'t have any document, create one now :)');
            }
          });
      }
  }]);
})();