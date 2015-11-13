/**
*  @module [DocService]
*
*  @description [service: return response for HTTP Request]
*/
angular.module('myApp')
  .value('documentAPI', '/api/documents')
  .factory('DocService', ['$http', 'documentAPI', '$log', function($http, documentAPI, $log) {
    return {

      /**
       * [createDocument POST creates a document]
       * @param     {[Object]}     params [contains document title and content to create]
       * @return    {[Object]}            [a promise from API]
       */
      createDocument : function(params) {
        return $http.post(documentAPI, { title : params.title, content : params.content });
      },

      /**
       * [getDocuments GET all documents]
       * @return    {[Object]}      [a promise from API]
       */
      getDocuments : function() {
        return $http.get(documentAPI);
      },

      /**
       * [getDocument GET a document]
       * @param     {[String]}    docID [contains docID]
       * @return    {[Object]}          [a promise from API]
       */
      getDocument : function(docID) {
        return $http.get(documentAPI + '/' + docID);
      },

      /**
       * [updateDocument PUT a document]
       * @param     {[String]}    docID  [contains docID]
       * @param     {[Object]}    params [contains document title and content to create]
       * @return    {[Object]}           [a promise from API]
       */
      updateDocument : function(docID, params) {
        return $http.put(documentAPI + '/' + docID, { title : params.title, content : params.content });
      },

      /**
       * [deleteDocument DELETE a document]
       * @param     {[String]}    docID  [contains docID]
       * @return    {[Object]}           [a promise from API]
       */
      deleteDocument : function(docID) {
        return $http.delete(documentAPI + '/' + docID);
      },
    };
  }]);