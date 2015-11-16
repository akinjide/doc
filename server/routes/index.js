var userRoutes = require('./user.route'),
    documentRoutes = require('./document.route');

module.exports = function(router) {
  userRoutes(router);
  documentRoutes(router);
};