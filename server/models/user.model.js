// get mongoose and an instance of Schema
var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema,

    // get bcrypt nodejs
    bcrypt    = require('bcrypt-nodejs');

/**
 * [userSchema description]
 * @type {Schema}
 */
var userSchema = new Schema (
  {
    username : {
      type     : String,
      required : 'username is required',
      unique   : true,
      index    : true,
      trim     : true,
    },
    name : {
      first : {
        type     : String,
        trim     : true,
        required : 'firstname is required',
        index    : true
      },
      last : {
        type     : String,
        trim     : true,
        required : 'lastname is required',
        index    : true
      }
    },
    email : {
      type      : String,
      trim      : true,
      unique    : true,
      lowercase : true,
      required  : 'email address is required',
      match     : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'email is incorrect, please match example@gmail.com']
    },
    password : {
      type      : String,
      required  : 'password is required',
      minlength : [5, 'password is shorter than the minimum allowed length 5']
    }
  }
);

/**
 * [userSchema pre method hash passwords to be sure 
 *   that we never save plaintext passwords, 
 *   before user object is saved ]
 * @param     {[method]}
 * @param     {[callback]}    (next)
 * @return    {[hash]}        [returns the hashed password to user object]
 */
userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password'))
    return next();
  // the salt is automatically generated and attached to the hash
  bcrypt.hash(user.password, null, null, function(err, hash) {
    if (err)
      return next(err);
    // store hash password in DB
    user.password = hash;
    next();
  });
});

/**
 * [comparePassword Load password hash from DB and compares 
 *                  with the user supplied password ]
 * @param     {[String]}     password [user supplied password]
 * @return    {[Boolean]}             [returns true if compared successfully]
 */
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

/**
 * [exports Compile a 'User' model using the userSchema as the structure.
 *          Mongoose also creates a MongoDB collection called 'User' for these documents.
 *          ]
 * @type {[Model]}
 */
module.exports = mongoose.model('User', userSchema);
