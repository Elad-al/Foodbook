'use strict';

/**
 * Module dependencies
 */
var follwesPolicy = require('../policies/follwes.server.policy'),
  follwes = require('../controllers/follwes.server.controller');

module.exports = function(app) {
  // Follwes Routes
  app.route('/api/follwes').all(follwesPolicy.isAllowed)
    .get(follwes.list)
    .post(follwes.create);

  app.route('/api/follwes/:follweId').all(/*follwesPolicy.isAllowed*/)
    .get(follwes.read)
    .post(follwes.update)
    .delete (follwes.update);

  // Finish by binding the Follwe middleware
  app.param('follweId', follwes.follweByID);
};
