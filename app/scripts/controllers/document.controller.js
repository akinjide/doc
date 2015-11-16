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