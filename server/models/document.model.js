// get mongoose and an instance of Schema
var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;

/**
 * [documentSchema description]
 * @type {Schema}
 */
var documentSchema = new Schema (
  {
    _ownerId : {
      type : Schema.Types.ObjectId,
      ref  : 'User'
    },
    title : {
      type     : String,
      trim     : true,
      unique   : true,
      required : 'document title is required'
    },
    content : {
      type : String,
      trim : true
    },
    dateCreated : {
      type    : Date,
      default : Date.now()
    },
    lastModified : {
      type    : Date,
      default : Date.now()
    }
  }
);

/**
 * [exports Compile a 'Document' model using the documentSchema as the structure.
 *          Mongoose also creates a MongoDB collection called 'Document' for these documents.
 *          ]
 * @type {[Model]}
 */
module.exports = mongoose.model('Document', documentSchema);
