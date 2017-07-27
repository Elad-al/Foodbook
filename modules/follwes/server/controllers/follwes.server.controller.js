'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Follwe = mongoose.model('Follwe'),
  Users = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Follwe
 */
exports.create = function(req, res) {
  var follwe = new Follwe(req.body);
  var user = req.user;
  user.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(follwe);
    }
  });


  //follwe.user = req.user;
    
  //follwe.save(function(err) {
  //  if (err) {
  //    return res.status(400).send({
  //      message: errorHandler.getErrorMessage(err)
  //    });
  //  } else {
  //    res.jsonp(follwe);
  //  }
  //});
};

/**
 * Show the current Follwe
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var follwe = req.follwe ? req.follwe.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  follwe.isCurrentUserOwner = req.user && follwe.user && follwe.user._id.toString() === req.user._id.toString();

  res.jsonp(follwe);
};



function containsObject(obj, list) {
  var i;
  for (i = 0; i < list.length; i++) {
    if (list[i] === obj) {
      return true;
    }
  }
  
  return false;
}

function removeElemnt(name, lst)
{
  var index = lst.indexOf(name);
  if (index > -1) {
    lst.splice(index, 1);
  }
}
/**
 * Update a Follwe
 */
exports.update = function(req, res) {
  var follwe = req.follwe;


  var user = req.user;
  var follwsList = user.follows;

  if(containsObject(follwe.username,follwsList))
  {
    //remove folloing
    removeElemnt(follwe.username, follwsList);
    var io = req.app.get('socketio');
    io.emit(req.user.username+'follwe.remove', follwsList); // emit an event for all connected users
  }
  else {
    //add follow
    follwsList.push(follwe.username);
  }
  user.follows = follwsList;
  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(follwe);
      var io = req.app.get('socketio');
      io.emit(req.user.username + 'follwe.update', follwsList); // emit an event for all connected users
    }
  });
  //follwe = _.extend(follwe, req.body);

  //follwe.save(function(err) {
  //  if (err) {
  //    return res.status(400).send({
  //      message: errorHandler.getErrorMessage(err)
  //    });
  //  } else {
  //    res.jsonp(follwe);
  //  }
  //});
};

/**
 * Delete an Follwe
 */
exports.delete = function(req, res) {
  var follwe = req.follwe;

  follwe.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(follwe);
    }
  });
};

/**
 * List of Follwes
 */
exports.list = function(req, res) {
  Users.find().sort('-created').populate('user', 'displayName').exec(function(err, follwes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(follwes);
    }
  });
};

/**
 * Follwe middleware
 */
exports.follweByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Follwe is invalid'
    });
  }

  Users.findById(id).populate('user', 'displayName').exec(function (err, follwe) {
    if (err) {
      return next(err);
    } else if (!follwe) {
      return res.status(404).send({
        message: 'No Follwe with that identifier has been found'
      });
    }
    req.follwe = follwe;
    next();
  });
};
