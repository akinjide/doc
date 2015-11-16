// get packages
var express = require('express'),
    router = express.Router(),

    // get mongoose document model
    documentController = require('../controllers/document.controller');

/** [exports defines all route] */
module.exports = function(router) {
  router.route('/documents')
    /**
     * retrieves all documents 
     * accessed at GET /api/documents
     */
    .get(documentController.getDocuments)

    /**
     * create a new document 
     * accessed at POST /api/documents
     */
    .post(documentController.createDocument);
  router.route('/documents/:id')
    /**
     * document by id 
     * accessed at GET /api/documents/:id
     * accessed at PUT /api/documents/:id
     * accessed at DELETE /api/documents/:id
     */
    .get(documentController.getDocument)
    .put(documentController.updateDocument)
    .delete(documentController.deleteDocument);
};