module.exports = {
  'database' : process.env.MONGO_DEV || process.env.MONGO_PROD,
  'secret'   : process.env.SECRET_DEV || process.env.SECRET_PROD,
  'key'      : process.env.KEY_DEV || process.env.KEY_PROD
}