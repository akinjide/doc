// get mongoose user and document model and config file
var Document = require('../models/document.model'),
    User = require('../models/user.model'),
    config   = require('../config/config');

/** @type {Object} [exports methods to be used by specific routes] */
module.exports = {

  /**
   * [createDocument find a document by username,
   *                 get document ID,
   *                 save it along with request]
   * @param     {[JSON]}     req 
   * @param     {[JSON]}     res 
   * @return    {[JSON]}         
   */
  createDocument : function(req, res) {
    User.findOne({ username : req.decoded.audience.username }, function(err, response) {
      if (err)
        return res.json({ statusCode : 500, status : 'Internal Server Error', response : err });

      if (!response) {
        return res.json({ statusCode : 403, status : 'Forbidden', statusMessage : 'please login or register to create a document', response : response });
      }
      else {
        var UserID = response._id,
            doc = new Document({
              _ownerId : UserID,
              title    : req.body.title,
              content  : req.body.content
            });

        doc.save(function(err, response) {
          if (err) {
            return res.json({ statusCode : 409, status : 'Conflict', response : err });
          }
          else {
            return res.json({ statusCode : 201, status : 'Created', statusMessage : 'document save successful', response : response });
          }
        });
      }
    });
  },

  /**
   * [getDocuments fetch all documents from the database]
   * @param     {[JSON]}       req
   * @param     {[JSON]}       res
   * @return    {[JSON]}          
   */
  getDocuments : function(req, res) {
    Document.find({}, function(err, response) {
      if (err) {
        return res.json({ statusCode : 500, status : 'Internal Server Error', response : err });
      }
      else {
        return res.json({ statusCode : 200, status : 'OK', response : response });
      }
    });
  },

  /**
   * [getDocument find a document by ID,
   *              return document with that ID]
   * @param     {[JSON]}      req
   * @param     {[JSON]}      res
   * @return    {[JSON]}        
   */
  getDocument : function(req, res) {
    var query = { _id : req.params.id };

    Document.findById(query, function(err, response) {
      if (err) {
        return res.json({ statusCode : 500, status : 'Internal Server Error', response : err });
      }
      else {
        if ((response)) {
          return res.json({ statusCode : 200, status : 'OK', response : response });
        }
        else {
          return res.json({ statusCode : 410, status : 'Gone', statusMessage : 'document does not exist', response : response });
        }
      }
    });
  },

  /**
   * [updateDocument find a document by ID,
   *                 update document with that ID,
   *                 update lastModified field]
   * @param     {[JSON]}       req
   * @param     {[JSON]}       res
   * @return    {[JSON]}          
   */
  updateDocument : function(req, res) {
    var update_at = Date.now(),
        query     = { _id : req.params.id };

    Document.findById(query, function(err, doc) {
      if (err)
        return res.json({ statusCode : 500, status : 'Internal Server Error', response : err });

      doc.title        = req.body.title;
      doc.content      = req.body.content;
      doc.lastModified = update_at;

      doc.save(function(err, response) {
        if (err) {
          return res.json({ statusCode : 500, status : 'Internal Server Error', statusMessage : 'document update failed', response : err });
        }
        else {
          return res.json({ statusCode : 200, status : 'OK', statusMessage : 'document update successful', response : response });
        }
      });
    });
  },

  /**
   * [deleteDocument find a document by ID,
   *                 delete the document with that ID]
   * @param     {[JSON]}      req
   * @param     {[JSON]}      res
   * @return    {[JSON]}         
   */
  deleteDocument : function(req, res) {
    var query = { _id : req.params.id };

    Document.remove(query, function(err, response) {
      if (err) {
        return res.json({ statusCode : 500, status : 'Internal Server Error', statusMessage : 'document delete failed', response : err });
      }
      else {
        return res.json({ statusCode : 200, status : 'OK', statusMessage : 'document delete successful', response : response });
      }
    });
  }
};