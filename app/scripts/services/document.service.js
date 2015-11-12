/**
*  @module [DocService]
*
*  @description [service: return response for HTTP Request]
*/
angular.module('myApp')
  .value('documentAPI', '/api/documents')
  .factory('DocService', ['$http', 'documentAPI', '$log', function($http, documentAPI, $log) {
    return {
      createDocument : function(params) {
        return $http.post(documentAPI, { title : params.title, content : params.content });
      },

      getDocuments : function() {
        return $http.get(documentAPI);
      },

      getDocument : function(docID) {
        return $http.get(documentAPI + '/' + docID);
      },

      updateDocument : function(docID, params) {
        return $http.put(documentAPI + '/' + docID, { title : params.title, content : params.content });
      },

      deleteDocument : function(docID) {
        return $http.delete(documentAPI + '/' + docID);
      },
    };
  }]);